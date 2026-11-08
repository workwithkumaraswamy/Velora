import { store } from '../../utils/store';

export class SupplierService {
  static async getSuppliers() {
    return store.suppliers.map(s => {
      const productsCount = store.products.filter(p => p.supplierId === s.id).length;
      return {
        ...s,
        productsCount
      };
    });
  }

  static async getSupplierById(id: string) {
    const supplier = store.suppliers.find(s => s.id === id);
    if (!supplier) throw new Error('Supplier not found');
    const products = store.products.filter(p => p.supplierId === supplier.id);
    return { ...supplier, products };
  }

  static async createSupplier(data: any) {
    const newSupplier = {
      id: `sup-${Date.now()}`,
      name: data.name,
      code: data.code || `SUP-${Math.floor(100 + Math.random() * 900)}`,
      contactName: data.contactName || '',
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || '',
      website: data.website || '',
      rating: Number(data.rating) || 4.5,
      leadTimeDays: Number(data.leadTimeDays) || 3,
      isActive: true,
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };
    store.suppliers.unshift(newSupplier);
    return newSupplier;
  }

  static async updateSupplier(id: string, updates: any) {
    const index = store.suppliers.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Supplier not found');
    store.suppliers[index] = { ...store.suppliers[index], ...updates };
    return store.suppliers[index];
  }

  static async deleteSupplier(id: string) {
    const index = store.suppliers.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Supplier not found');
    store.suppliers.splice(index, 1);
    return { success: true };
  }

  // Supplier purchase orders
  static async getSupplierOrders() {
    return store.supplierOrders;
  }

  static async updateSupplierOrderStatus(supplierOrderId: string, status: string, trackingInfo?: any) {
    const index = store.supplierOrders.findIndex(so => so.id === supplierOrderId);
    if (index === -1) throw new Error('Supplier order not found');

    store.supplierOrders[index].status = status;
    if (trackingInfo?.trackingNumber) {
      store.supplierOrders[index].trackingNumber = trackingInfo.trackingNumber;
      store.supplierOrders[index].courierName = trackingInfo.courierName;
    }
    if (status === 'CONFIRMED') {
      store.supplierOrders[index].confirmedAt = new Date().toISOString();
    } else if (status === 'SHIPPED') {
      store.supplierOrders[index].shippedAt = new Date().toISOString();
    }

    return store.supplierOrders[index];
  }
}
