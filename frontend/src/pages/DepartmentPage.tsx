import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Product, Category, Department } from '../types';
import { api } from '../services/api';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters, FilterState } from '../components/product/ProductFilters';
import { Modal } from '../components/common/Modal';

interface DepartmentPageProps {
  forcedDepartment?: 'men' | 'women' | 'kids';
}

export const DepartmentPage: React.FC<DepartmentPageProps> = ({ forcedDepartment }) => {
  const { deptSlug: paramSlug } = useParams<{ deptSlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const departmentSlug = forcedDepartment || paramSlug || 'men';

  const [department, setDepartment] = useState<Department | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters State synced from URL
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || undefined,
    size: searchParams.get('size') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    sort: searchParams.get('sort') || 'recommended',
  });

  const searchQuery = searchParams.get('search') || '';

  // Fetch department metadata & categories
  useEffect(() => {
    const fetchDeptData = async () => {
      try {
        const [deptRes, catRes] = await Promise.all([
          api.get(`/catalog/departments/${departmentSlug}`),
          api.get(`/catalog/categories?departmentSlug=${departmentSlug}`),
        ]);
        setDepartment(deptRes.data.data);
        setCategories(catRes.data.data || []);
      } catch (err) {
        console.error('Error fetching department data:', err);
      }
    };

    fetchDeptData();
  }, [departmentSlug]);

  // Fetch filtered products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, any> = {
          department: departmentSlug,
          sort: filters.sort,
          limit: 24,
        };

        if (filters.category) params.category = filters.category;
        if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
        if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
        if (filters.size) params.size = filters.size;
        if (filters.minRating) params.minRating = filters.minRating;
        if (filters.inStock) params.inStock = true;
        if (searchQuery) params.search = searchQuery;

        const res = await api.get('/products', { params });
        setProducts(res.data.data || []);
        setTotalProducts(res.data.meta?.total || (res.data.data || []).length);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [departmentSlug, filters, searchQuery]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    const params = new URLSearchParams(searchParams);

    if (newFilters.category) params.set('category', newFilters.category);
    else params.delete('category');

    if (newFilters.size) params.set('size', newFilters.size);
    else params.delete('size');

    if (newFilters.minPrice !== undefined) params.set('minPrice', String(newFilters.minPrice));
    else params.delete('minPrice');

    if (newFilters.maxPrice !== undefined) params.set('maxPrice', String(newFilters.maxPrice));
    else params.delete('maxPrice');

    if (newFilters.minRating) params.set('minRating', String(newFilters.minRating));
    else params.delete('minRating');

    if (newFilters.inStock) params.set('inStock', 'true');
    else params.delete('inStock');

    if (newFilters.sort) params.set('sort', newFilters.sort);

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setFilters({ sort: 'recommended' });
    setSearchParams(new URLSearchParams());
  };

  const sortOptions = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Best Selling / Trending', value: 'best-seller' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Biggest Discount', value: 'discount' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Department Hero Banner */}
      <div className="relative h-72 sm:h-96 w-full bg-velora-black overflow-hidden border-b border-velora-border">
        <img
          src={
            department?.heroBanner ||
            'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1600&auto=format&fit=crop&q=85'
          }
          alt={department?.name || 'Department'}
          className="w-full h-full object-cover object-center filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full text-white space-y-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-light">
              {department?.name}’s Haute Curation
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-wide">
              {department?.name === 'Men'
                ? 'Men’s Sartorial & Essentials'
                : department?.name === 'Women'
                ? 'Women’s Haute Couture & Silks'
                : 'Kids’ Festive & Playful Comfort'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-xl">
              {department?.description ||
                'Thoughtfully tailored fashion and handcrafted luxury delivered directly to your doorstep.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pill Navigation */}
        {categories.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 border-b border-velora-border no-scrollbar">
            <button
              onClick={() => handleFilterChange({ ...filters, category: undefined })}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest font-medium border flex-shrink-0 transition-colors ${
                !filters.category
                  ? 'bg-velora-black text-white border-velora-black'
                  : 'bg-white text-neutral-700 border-velora-border hover:border-black'
              }`}
            >
              All {department?.name}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleFilterChange({ ...filters, category: c.slug })}
                className={`px-4 py-1.5 text-xs uppercase tracking-widest font-medium border flex-shrink-0 transition-colors ${
                  filters.category === c.slug
                    ? 'bg-velora-black text-white border-velora-black'
                    : 'bg-white text-neutral-700 border-velora-border hover:border-black'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Action Bar (Search query indicator, count, sort & mobile filter trigger) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 gap-4">
          <div>
            <p className="text-xs text-neutral-500 font-light">
              Displaying <strong className="font-semibold text-velora-black">{products.length}</strong> creations
              {searchQuery && (
                <span>
                  {' '}for search query "<strong className="text-velora-black">{searchQuery}</strong>"
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-1.5 px-3 py-2 border border-velora-border bg-white text-xs uppercase tracking-wider font-medium text-velora-black"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-velora-champagne-dark" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 hidden sm:inline-block">
                Sort By:
              </span>
              <select
                value={filters.sort || 'recommended'}
                onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
                className="bg-white border border-velora-border py-2 px-3 text-xs text-velora-black focus:outline-none focus:border-velora-champagne tracking-wider uppercase"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Sidebar Filters + Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-white border border-velora-border p-5">
              <ProductFilters
                categories={categories}
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                totalProductsCount={totalProducts}
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              emptyMessage={`No creations found in the ${department?.name || 'requested'} department matching your chosen criteria.`}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer / Modal */}
      <Modal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Refine Collection"
        maxWidth="md"
      >
        <ProductFilters
          categories={categories}
          filters={filters}
          onChange={(f) => {
            handleFilterChange(f);
            setIsMobileFilterOpen(false);
          }}
          onClear={() => {
            handleClearFilters();
            setIsMobileFilterOpen(false);
          }}
          totalProductsCount={totalProducts}
        />
      </Modal>
    </div>
  );
};
