export type Role = 
  | 'SUPER_ADMIN' 
  | 'MENS_MANAGER' 
  | 'WOMENS_MANAGER' 
  | 'KIDS_MANAGER' 
  | 'ORDER_MANAGER' 
  | 'SUPPORT_MANAGER' 
  | 'CUSTOMER';

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface UserAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  houseNumber: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  addressType: 'Home' | 'Office' | 'Other';
  isDefault: boolean;
}

export interface Department {
  id: string;
  name: string;
  slug: 'men' | 'women' | 'kids';
  description?: string;
  heroBanner?: string;
  heroSubtitle?: string;
  sortOrder: number;
}

export interface Category {
  id: string;
  departmentId: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  isAiGenerated?: boolean;
  styleTag?: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  colorHex?: string;
  sku: string;
  stock: number;
  reservedStock?: number;
  priceOverride?: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  departmentId: string;
  department?: Department;
  categoryId: string;
  category?: Category;
  brandId?: string;
  brand?: Brand;
  supplierId?: string;
  supplier?: Supplier;
  shortDescription?: string;
  description: string;
  highlights?: string[];
  specifications?: Record<string, string>;
  careInstructions?: string;
  basePrice: number;
  mrp: number;
  costPrice?: number;
  discountPercentage: number;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  totalStock: number;
  averageRating: number;
  reviewCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  brandName?: string;
  imageUrl?: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  supplierStatus?: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SUPPLIER_REQUESTED'
  | 'SUPPLIER_CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'REFUNDED';

export type PaymentMethod = 'COD' | 'RAZORPAY' | 'WALLET';
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: Partial<User>;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddressSnapshot: UserAddress;
  items: OrderItem[];
  customerNotes?: string;
  cancelReason?: string;
  placedAt: string;
  updatedAt: string;
  shipment?: {
    courierName: string;
    trackingNumber: string;
    trackingUrl?: string;
    status: string;
    shippedAt?: string;
    estimatedDelivery?: string;
    deliveredAt?: string;
  };
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contactName?: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  rating: number;
  leadTimeDays: number;
  isActive: boolean;
  notes?: string;
  productsCount?: number;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxDiscount?: number;
  minOrderValue: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
  departmentId?: string;
  timesUsed?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  photos?: string[];
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber?: string;
  order?: Partial<Order>;
  userId: string;
  reason: string;
  detailedReason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PICKED_UP' | 'REFUND_ISSUED';
  refundAmount: number;
  bankDetails?: string;
  proofImages?: string[];
  adminNotes?: string;
  requestedAt: string;
  resolvedAt?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  orderId?: string;
  subject: string;
  department: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  messages: Array<{
    id: string;
    sender: 'user' | 'agent';
    senderName?: string;
    text: string;
    sentAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  targetUrl: string;
  imageUrl: string;
  placement: 'HERO' | 'MID_BANNER' | 'PROMO_STRIP';
  department?: string;
  isActive: boolean;
  sortOrder: number;
}
