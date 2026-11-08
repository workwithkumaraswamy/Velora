import { store } from '../../utils/store';

export class AnalyticsService {
  static async getDashboardOverview() {
    const orders = store.orders;
    const products = store.products;
    const users = store.users;
    const suppliers = store.suppliers;

    // Revenue calculations
    const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'SUCCESS' || o.paymentMethod === 'COD' ? o.totalAmount : 0), 0);
    const totalSupplierCost = orders.reduce((acc, o) => {
      const itemsCost = o.items.reduce((s: number, it: any) => s + (it.unitPrice * 0.45 * it.quantity), 0);
      return acc + itemsCost;
    }, 0);
    const totalDiscounts = orders.reduce((acc, o) => acc + (o.discountAmount || 0), 0);
    const estimatedProfit = Math.max(0, totalRevenue - totalSupplierCost);

    // Orders status counts
    const statusCounts = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING' || o.status === 'PAYMENT_PENDING').length,
      confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
      processing: orders.filter(o => o.status === 'PROCESSING' || o.status === 'SUPPLIER_REQUESTED').length,
      shipped: orders.filter(o => o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length,
      returnRequested: orders.filter(o => o.status === 'RETURN_REQUESTED').length,
    };

    // Inventory metrics
    const lowStockThreshold = 10;
    const lowStockProducts = products.filter(p => p.totalStock <= lowStockThreshold && p.totalStock > 0);
    const outOfStockProducts = products.filter(p => p.totalStock === 0);

    // Department Performance
    const departmentMetrics = store.departments.map(dept => {
      const deptProducts = products.filter(p => p.departmentId === dept.id);
      const deptOrders = orders.filter(o => 
        o.items.some((it: any) => deptProducts.some(p => p.id === it.productId))
      );
      const revenue = deptOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      return {
        id: dept.id,
        name: dept.name,
        slug: dept.slug,
        revenue,
        ordersCount: deptOrders.length,
        productsCount: deptProducts.length,
      };
    });

    // Best-selling products
    const bestSellers = [...products]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        title: p.title,
        price: p.basePrice,
        rating: p.averageRating,
        reviews: p.reviewCount,
        stock: p.totalStock,
        image: p.images?.[0]?.url || '',
        department: store.departments.find(d => d.id === p.departmentId)?.name || 'Fashion'
      }));

    // Payment methods breakdown
    const paymentMethods = {
      razorpay: orders.filter(o => o.paymentMethod === 'RAZORPAY').length,
      cod: orders.filter(o => o.paymentMethod === 'COD').length,
    };

    return {
      financials: {
        totalRevenue: Math.round(totalRevenue),
        estimatedProfit: Math.round(estimatedProfit),
        totalSupplierCost: Math.round(totalSupplierCost),
        totalDiscounts: Math.round(totalDiscounts),
        averageOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
      },
      orders: statusCounts,
      inventory: {
        totalProducts: products.length,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        lowStockProducts: lowStockProducts.slice(0, 5).map(p => ({ id: p.id, title: p.title, stock: p.totalStock })),
      },
      customers: {
        totalCustomers: users.filter(u => u.role === 'CUSTOMER').length,
        totalManagers: users.filter(u => u.role !== 'CUSTOMER').length,
      },
      suppliers: {
        totalSuppliers: suppliers.length,
        pendingSupplierOrders: store.supplierOrders.filter(so => so.status === 'REQUESTED').length,
      },
      departmentMetrics,
      bestSellers,
      paymentMethods,
    };
  }
}
