import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  Truck, 
  Sparkles, 
  PlusCircle, 
  ArrowRight,
  Download
} from 'lucide-react';
import { api } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import { MetricCard } from '../../components/admin/MetricCard';
import { Button } from '../../components/common/Button';

export const DashboardOverview: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/analytics/overview');
        setData(res.data.data);
      } catch (err) {
        console.error('Error fetching admin dashboard overview:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (isLoading || !data) {
    return <div className="p-8 text-xs text-neutral-500">Loading business metrics...</div>;
  }

  const { financials, orders, inventory, customers, suppliers, departmentMetrics, bestSellers, paymentMethods } = data;

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Executive Summary
          </span>
          <h1 className="font-serif text-3xl text-velora-black font-normal mt-0.5">
            Business Overview & Operations
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/admin/import">
            <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
              Import Supplier URL
            </Button>
          </Link>
          <Link to="/admin/ai-studio">
            <Button variant="champagne" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              AI Product Studio
            </Button>
          </Link>
          <Link to="/admin/products/new">
            <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-3.5 h-3.5" />}>
              New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Gross Revenue"
          value={formatINR(financials.totalRevenue)}
          trend="+18.4% vs last month"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5" />}
          subtitle={`Average order value: ${formatINR(financials.averageOrderValue)}`}
        />

        <MetricCard
          title="Estimated Gross Profit"
          value={formatINR(financials.estimatedProfit)}
          trend="48% Gross Margin"
          isPositive={true}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle={`Supplier fulfillments: ${formatINR(financials.totalSupplierCost)}`}
        />

        <MetricCard
          title="Total Orders Processed"
          value={orders.total}
          trend={`${orders.shipped + orders.delivered} fulfilled`}
          isPositive={true}
          icon={<ShoppingBag className="w-5 h-5" />}
          subtitle={`${orders.pending} pending confirmation`}
        />

        <MetricCard
          title="Active Catalog Items"
          value={inventory.totalProducts}
          trend={inventory.lowStockCount > 0 ? `${inventory.lowStockCount} low stock` : 'Healthy levels'}
          isPositive={inventory.lowStockCount === 0}
          icon={<Package className="w-5 h-5" />}
          subtitle={`${suppliers.totalSuppliers} dropshipping suppliers`}
        />
      </div>

      {/* Low Stock Alert Strip if any */}
      {inventory.lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 p-4 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Inventory Notice:</strong> {inventory.lowStockCount} items have reached low stock threshold (≤ 10 pieces). Consider requesting supplier restocking.
            </span>
          </div>
          <Link to="/admin/products" className="font-semibold underline uppercase tracking-wider text-[11px] ml-4">
            Manage Inventory →
          </Link>
        </div>
      )}

      {/* Department Performance Cards */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl text-velora-black font-normal">
          Departmental Performance Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departmentMetrics.map((dept: any) => (
            <div key={dept.id} className="bg-white border border-velora-border p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
                  {dept.name}’s Department
                </span>
                <span className="text-[10px] bg-velora-beige px-2 py-0.5 font-medium uppercase text-velora-black">
                  {dept.productsCount} Products
                </span>
              </div>
              <div>
                <span className="font-serif text-2xl text-velora-black block">
                  {formatINR(dept.revenue)}
                </span>
                <span className="text-xs text-neutral-500 font-light mt-0.5 block">
                  {dept.ordersCount} total orders attributed
                </span>
              </div>
              <Link
                to={`/admin/products?department=${dept.slug}`}
                className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-velora-champagne-dark hover:underline pt-2"
              >
                <span>View {dept.name} Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Best Sellers & Payment Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Best Sellers Table */}
        <div className="lg:col-span-2 bg-white border border-velora-border p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-velora-border">
            <h3 className="font-serif text-lg text-velora-black font-normal">
              Top Performing Creations
            </h3>
            <Link to="/admin/products" className="text-xs text-neutral-500 hover:text-black">
              View All
            </Link>
          </div>

          <div className="divide-y divide-velora-border overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-neutral-400 bg-velora-ivory/50">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Stock</th>
                  <th className="py-2.5 px-3">Appraisals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-velora-border">
                {bestSellers.map((item: any) => (
                  <tr key={item.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-3 flex items-center space-x-3">
                      <img src={item.image} alt={item.title} className="w-8 h-10 object-cover border border-velora-border" />
                      <span className="font-medium text-velora-black truncate max-w-xs">{item.title}</span>
                    </td>
                    <td className="py-3 px-3 text-neutral-500">{item.department}</td>
                    <td className="py-3 px-3 font-semibold text-velora-black">{formatINR(item.price)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-1.5 py-0.5 text-[10px] font-semibold ${item.stock <= 10 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {item.stock} left
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-600">
                      ★ {item.rating} ({item.reviews})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods & Dropshipping Fulfillment Overview */}
        <div className="bg-white border border-velora-border p-6 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-velora-black font-normal pb-3 border-b border-velora-border">
              Payment Gateway Share
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Razorpay Online (Prepaid)</span>
                  <span className="font-bold">{paymentMethods.razorpay} orders</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 overflow-hidden">
                  <div
                    className="h-full bg-velora-champagne-dark"
                    style={{
                      width: `${
                        orders.total > 0
                          ? Math.round((paymentMethods.razorpay / orders.total) * 100)
                          : 50
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Cash on Delivery (COD)</span>
                  <span className="font-bold">{paymentMethods.cod} orders</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 overflow-hidden">
                  <div
                    className="h-full bg-velora-black"
                    style={{
                      width: `${
                        orders.total > 0
                          ? Math.round((paymentMethods.cod / orders.total) * 100)
                          : 50
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dropshipping Fulfillment Panel */}
          <div className="p-4 bg-velora-ivory border border-velora-border space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-velora-black font-semibold uppercase tracking-wider text-[11px]">
              <Truck className="w-4 h-4 text-velora-champagne-dark" />
              <span>Dropshipping Operations</span>
            </div>
            <p className="text-neutral-500 font-light leading-relaxed">
              {suppliers.pendingSupplierOrders} supplier purchase orders awaiting confirmation. All shipments sync automatically with courier partners BlueDart & Delhivery.
            </p>
            <Link
              to="/admin/supplier-orders"
              className="inline-block pt-1 font-semibold text-velora-black underline text-[11px]"
            >
              Manage Supplier Purchase Orders →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
