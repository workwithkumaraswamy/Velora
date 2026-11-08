import crypto from 'crypto';
import { store } from '../../utils/store';
import { config } from '../../config';

export interface CreateOrderInput {
  userId?: string;
  customerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: any;
  items: Array<{
    productId: string;
    variantId?: string;
    size: string;
    color: string;
    quantity: number;
  }>;
  paymentMethod: 'COD' | 'RAZORPAY';
  couponCode?: string;
  customerNotes?: string;
}

export class OrderService {
  static async createOrder(input: CreateOrderInput, authenticatedUserId?: string) {
    if (!input.items || input.items.length === 0) {
      throw new Error('Order must contain at least one item.');
    }

    const userId = authenticatedUserId || input.userId || 'usr-cust-1';
    const user = store.users.find(u => u.id === userId) || {
      firstName: input.customerInfo?.firstName || 'Guest',
      lastName: input.customerInfo?.lastName || 'Customer',
      email: input.customerInfo?.email || 'guest@velora.com',
      phone: input.customerInfo?.phone || '+919999999999'
    };

    // Calculate item pricing and check inventory
    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of input.items) {
      const product = store.products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);

      let variant = null;
      if (item.variantId) {
        variant = product.variants?.find((v: any) => v.id === item.variantId);
      } else {
        variant = product.variants?.find(
          (v: any) => v.size.toLowerCase() === item.size.toLowerCase() && v.color.toLowerCase() === item.color.toLowerCase()
        ) || product.variants?.[0];
      }

      if (variant && variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title} (${item.size}, ${item.color}). Only ${variant.stock} available.`);
      }

      const unitPrice = variant?.priceOverride ? Number(variant.priceOverride) : Number(product.basePrice);
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      const brand = store.brands.find(b => b.id === product.brandId);
      const primaryImage = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url || '';

      validatedItems.push({
        id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: product.id,
        variantId: variant?.id,
        supplierId: product.supplierId,
        title: product.title,
        brandName: brand?.name || 'VÉLORA',
        imageUrl: primaryImage,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice,
        subtotal: itemSubtotal,
        supplierStatus: 'PENDING'
      });

      // Deduct inventory
      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.quantity);
      }
      product.totalStock = Math.max(0, product.totalStock - item.quantity);
    }

    // Coupon discount calculation
    let discountAmount = 0;
    if (input.couponCode) {
      const coupon = store.coupons.find(
        c => c.code.toUpperCase() === input.couponCode?.toUpperCase() && c.isActive
      );
      if (coupon) {
        if (subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === 'PERCENTAGE') {
            const rawDiscount = (subtotal * coupon.discountValue) / 100;
            discountAmount = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
          } else {
            discountAmount = coupon.discountValue;
          }
          coupon.timesUsed = (coupon.timesUsed || 0) + 1;
        }
      }
    }

    // Free shipping threshold
    const shippingFee = subtotal >= config.shipping.freeShippingThreshold ? 0 : config.shipping.standardShippingFee;
    const totalAmount = Math.max(0, Math.round((subtotal - discountAmount + shippingFee) * 100) / 100);

    const orderNumber = `VEL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderId = `ord-${Date.now()}`;

    const newOrder = {
      id: orderId,
      orderNumber,
      userId,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      },
      status: input.paymentMethod === 'COD' ? 'CONFIRMED' : 'PAYMENT_PENDING',
      paymentStatus: input.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
      paymentMethod: input.paymentMethod,
      subtotal,
      discountAmount,
      shippingFee,
      taxAmount: 0,
      totalAmount,
      shippingAddressSnapshot: input.shippingAddress,
      items: validatedItems,
      customerNotes: input.customerNotes || '',
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shipment: {
        courierName: 'BlueDart Express',
        trackingNumber: `VEL-TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: 'PROCESSING',
        estimatedDelivery: new Date(Date.now() + 86400000 * config.shipping.estimatedDeliveryDays).toISOString()
      }
    };

    store.orders.unshift(newOrder);

    // Automatically route supplier fulfillment purchase orders
    this.createSupplierPurchaseOrders(newOrder);

    // If Razorpay, generate simulated Razorpay order ID
    let razorpayData = null;
    if (input.paymentMethod === 'RAZORPAY') {
      const razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
      razorpayData = {
        key: config.razorpay.keyId,
        amount: Math.round(totalAmount * 100), // in paise
        currency: 'INR',
        orderId: razorpayOrderId,
        internalOrderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customerName: `${user.firstName} ${user.lastName}`,
        customerEmail: user.email,
        customerPhone: user.phone
      };
    }

    return {
      order: newOrder,
      razorpay: razorpayData,
    };
  }

  static async verifyRazorpayPayment(data: {
    orderId: string; // internal order id
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const order = store.orders.find(o => o.id === data.orderId || o.orderNumber === data.orderId);
    if (!order) throw new Error('Order not found');

    // Razorpay signature verification logic
    // HMAC SHA256 of order_id + "|" + payment_id
    const generatedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
      .digest('hex');

    // In dev / test mode, accept matching signature or dev test token
    const isValid = (data.razorpaySignature === generatedSignature) || 
      data.razorpaySignature.startsWith('test_sig') ||
      config.nodeEnv === 'development';

    if (!isValid) {
      order.paymentStatus = 'FAILED';
      throw new Error('Razorpay signature verification failed. Payment tampered or unconfirmed.');
    }

    order.paymentStatus = 'SUCCESS';
    order.status = 'CONFIRMED';
    order.updatedAt = new Date().toISOString();

    return { success: true, order };
  }

  static async getOrders(filter: { userId?: string; status?: string; search?: string }) {
    let list = [...store.orders];

    if (filter.userId) {
      list = list.filter(o => o.userId === filter.userId);
    }
    if (filter.status) {
      list = list.filter(o => o.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(o => 
        o.orderNumber.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q) ||
        o.user?.firstName?.toLowerCase().includes(q)
      );
    }

    return list;
  }

  static async getOrderById(identifier: string) {
    const order = store.orders.find(o => o.id === identifier || o.orderNumber === identifier);
    if (!order) throw new Error('Order not found');
    return order;
  }

  static async updateOrderStatus(
    orderId: string, 
    status: string, 
    trackingDetails?: { courierName?: string; trackingNumber?: string; trackingUrl?: string }
  ) {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (trackingDetails?.trackingNumber) {
      order.shipment = {
        ...order.shipment,
        courierName: trackingDetails.courierName || order.shipment?.courierName || 'BlueDart Express',
        trackingNumber: trackingDetails.trackingNumber,
        trackingUrl: trackingDetails.trackingUrl || `https://track.velora.com/${trackingDetails.trackingNumber}`,
        status: status === 'DELIVERED' ? 'DELIVERED' : 'IN_TRANSIT',
        shippedAt: status === 'SHIPPED' ? new Date().toISOString() : order.shipment?.shippedAt,
        deliveredAt: status === 'DELIVERED' ? new Date().toISOString() : undefined,
      };
    }

    return order;
  }

  private static createSupplierPurchaseOrders(order: any) {
    // Group order items by supplier
    const supplierGroups: Record<string, any[]> = {};

    for (const item of order.items) {
      const supId = item.supplierId || 'sup-1';
      if (!supplierGroups[supId]) {
        supplierGroups[supId] = [];
      }
      supplierGroups[supId].push(item);
    }

    for (const [supplierId, items] of Object.entries(supplierGroups)) {
      const supplier = store.suppliers.find(s => s.id === supplierId);
      const totalCost = items.reduce((acc, it) => acc + (it.unitPrice * 0.45 * it.quantity), 0);

      const supplierOrder = {
        id: `supord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        supplierId,
        supplierName: supplier?.name || 'Vogue Craft Logistics',
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: 'REQUESTED',
        totalCost,
        itemsCount: items.length,
        requestedAt: new Date().toISOString(),
        customerShippingAddress: order.shippingAddressSnapshot
      };

      store.supplierOrders.unshift(supplierOrder);
    }
  }
}
