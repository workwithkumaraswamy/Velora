import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ExternalLink, Package, Filter } from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

export const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/products?limit=100');
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you certain you wish to delete "${title}" from the catalog?`)) {
      return;
    }
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      departmentFilter === 'all' || p.department?.slug === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Catalog Administration
          </span>
          <h1 className="font-serif text-2xl text-velora-black font-normal mt-0.5">
            Master Product Management ({products.length} Products)
          </h1>
        </div>

        <Link to="/admin/products/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-velora-border p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search products or brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-50 border border-velora-border py-2 pl-9 pr-3 text-xs text-velora-black focus:outline-none"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs uppercase tracking-wider text-neutral-400">Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-neutral-50 border border-velora-border py-2 px-3 text-xs uppercase text-velora-black focus:outline-none"
          >
            <option value="all">All Departments</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-velora-border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs divide-y divide-velora-border">
          <thead className="bg-velora-ivory/60 text-neutral-500 uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Product Details</th>
              <th className="py-3 px-4">Department / Category</th>
              <th className="py-3 px-4">Selling Price / MRP</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Supplier</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-velora-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50">
                <td className="py-3 px-4 flex items-center space-x-3">
                  <img
                    src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200'}
                    alt={p.title}
                    className="w-10 h-12 object-cover border border-velora-border flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold block">{p.brand?.name || 'VÉLORA'}</span>
                    <span className="font-medium text-velora-black line-clamp-1">{p.title}</span>
                    <span className="text-[10px] text-neutral-400">Slug: {p.slug}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold uppercase text-[10px] block text-velora-black">{p.department?.name}</span>
                  <span className="text-neutral-500 text-[11px]">{p.category?.name}</span>
                </td>
                <td className="py-3 px-4 font-sans">
                  <span className="font-semibold text-velora-black block">{formatINR(p.basePrice)}</span>
                  <span className="text-[11px] text-neutral-400 line-through">{formatINR(p.mrp)}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    p.totalStock <= 10 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {p.totalStock} Available
                  </span>
                </td>
                <td className="py-3 px-4 text-neutral-600 text-[11px]">
                  {p.supplier?.name || 'Vogue Craft Ltd.'}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <Link
                    to={`/product/${p.slug}`}
                    target="_blank"
                    className="p-1.5 inline-block text-neutral-400 hover:text-black"
                    title="View on store"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-1.5 inline-block text-neutral-400 hover:text-rose-600"
                    title="Delete product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
