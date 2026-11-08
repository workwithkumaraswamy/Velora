import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, DollarSign, Calendar, Layers, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { MetricCard } from '../../components/admin/MetricCard';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/overview');
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleExportCSV = () => {
    if (!data) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      `Gross Revenue,${data.financials.totalRevenue}\n` +
      `Estimated Gross Profit,${data.financials.estimatedProfit}\n` +
      `Supplier Costs,${data.financials.totalSupplierCost}\n` +
      `Discounts Granted,${data.financials.totalDiscounts}\n` +
      `Average Order Value,${data.financials.averageOrderValue}\n` +
      `Total Orders,${data.orders.total}\n` +
      `Total Active Products,${data.inventory.totalProducts}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `velora_financial_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !data) {
    return <div className="p-8 text-xs text-neutral-500">Compiling financial analytics...</div>;
  }

  const { financials, orders, departmentMetrics, bestSellers, paymentMethods } = data;

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Business Intelligence
          </span>
          <h1 className="font-serif text-2xl text-velora-black font-normal mt-0.5">
            Enterprise Financial & Department Analytics
          </h1>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={handleExportCSV}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export Financial Report (CSV)
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Gross Market Revenue"
          value={formatINR(financials.totalRevenue)}
          trend="Healthy Trajectory"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <MetricCard
          title="Estimated Gross Profit"
          value={formatINR(financials.estimatedProfit)}
          trend="48% Margin"
          isPositive={true}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          title="Supplier COGS"
          value={formatINR(financials.totalSupplierCost)}
          subtitle="Direct Dropshipping Costs"
          icon={<Layers className="w-5 h-5" />}
        />
        <MetricCard
          title="Marketing Discounts"
          value={formatINR(financials.totalDiscounts)}
          subtitle="Voucher Promotions Given"
          icon={<BarChart3 className="w-5 h-5" />}
        />
      </div>

      {/* Department Share Table & Chart */}
      <div className="bg-white border border-velora-border p-6 space-y-4 shadow-sm">
        <h3 className="font-serif text-lg text-velora-black font-normal pb-3 border-b border-velora-border">
          Departmental Revenue & Contribution Analysis
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-velora-border">
            <thead className="bg-velora-ivory/60 text-[10px] uppercase font-semibold text-neutral-400">
              <tr>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Products Mapped</th>
                <th className="py-2.5 px-3">Orders Attributed</th>
                <th className="py-2.5 px-3">Gross Sales</th>
                <th className="py-2.5 px-3">Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-velora-border">
              {departmentMetrics.map((dept: any) => {
                const sharePct =
                  financials.totalRevenue > 0
                    ? Math.round((dept.revenue / financials.totalRevenue) * 100)
                    : 33;
                return (
                  <tr key={dept.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-3 font-semibold text-velora-black">{dept.name}</td>
                    <td className="py-3 px-3 text-neutral-600">{dept.productsCount} Items</td>
                    <td className="py-3 px-3 text-neutral-600">{dept.ordersCount} Orders</td>
                    <td className="py-3 px-3 font-semibold text-velora-black font-sans">{formatINR(dept.revenue)}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-neutral-200 overflow-hidden">
                          <div className="h-full bg-velora-champagne-dark" style={{ width: `${sharePct}%` }} />
                        </div>
                        <span className="font-mono text-[11px] text-neutral-500">{sharePct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
