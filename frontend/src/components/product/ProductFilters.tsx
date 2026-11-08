import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Category } from '../../types';

export interface FilterState {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  minRating?: number;
  inStock?: boolean;
  sort?: string;
}

interface ProductFiltersProps {
  categories: Category[];
  filters: FilterState;
  onChange: (updated: FilterState) => void;
  onClear: () => void;
  totalProductsCount: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  filters,
  onChange,
  onClear,
  totalProductsCount,
}) => {
  const priceRanges = [
    { label: 'All Prices', min: undefined, max: undefined },
    { label: 'Under ₹3,000', min: undefined, max: 3000 },
    { label: '₹3,000 – ₹7,000', min: 3000, max: 7000 },
    { label: '₹7,000 – ₹12,000', min: 7000, max: 12000 },
    { label: 'Above ₹12,000', min: 12000, max: undefined },
  ];

  const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'Free Size'];

  const handlePriceSelect = (min?: number, max?: number) => {
    onChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleCategorySelect = (slug: string) => {
    onChange({
      ...filters,
      category: filters.category === slug ? undefined : slug,
    });
  };

  const handleSizeToggle = (sz: string) => {
    onChange({
      ...filters,
      size: filters.size === sz ? undefined : sz,
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.size ||
    filters.minRating ||
    filters.inStock;

  return (
    <div className="space-y-6 text-xs text-velora-black">
      {/* Filter Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-velora-border">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-velora-champagne-dark" />
          <span className="font-semibold uppercase tracking-wider text-xs">
            Filters ({totalProductsCount})
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center space-x-1 text-[11px] text-neutral-500 hover:text-velora-black uppercase tracking-wider underline underline-offset-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="font-semibold uppercase tracking-widest text-[11px] text-neutral-500">
            Category
          </h4>
          <div className="space-y-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full text-left py-1.5 px-2 text-xs transition-colors flex items-center justify-between ${
                  filters.category === cat.slug
                    ? 'bg-velora-black text-white font-medium'
                    : 'text-neutral-700 hover:bg-velora-beige'
                }`}
              >
                <span>{cat.name}</span>
                {filters.category === cat.slug && <X className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-2.5 pt-4 border-t border-velora-border">
        <h4 className="font-semibold uppercase tracking-widest text-[11px] text-neutral-500">
          Price Range
        </h4>
        <div className="space-y-1">
          {priceRanges.map((range, i) => {
            const isSelected =
              filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <label
                key={i}
                className="flex items-center space-x-2 py-1 cursor-pointer group"
                onClick={() => handlePriceSelect(range.min, range.max)}
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-3.5 h-3.5 text-velora-champagne accent-velora-black focus:ring-0"
                />
                <span
                  className={`text-xs ${
                    isSelected ? 'font-semibold text-velora-black' : 'text-neutral-600 group-hover:text-black'
                  }`}
                >
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-2.5 pt-4 border-t border-velora-border">
        <h4 className="font-semibold uppercase tracking-widest text-[11px] text-neutral-500">
          Size
        </h4>
        <div className="grid grid-cols-3 gap-1.5">
          {commonSizes.map((sz) => {
            const isSelected = filters.size === sz;
            return (
              <button
                key={sz}
                onClick={() => handleSizeToggle(sz)}
                className={`py-1.5 px-2 text-[11px] font-medium border text-center transition-colors ${
                  isSelected
                    ? 'bg-velora-black text-white border-velora-black'
                    : 'bg-white text-neutral-700 border-velora-border hover:border-black'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating & In-Stock */}
      <div className="space-y-3 pt-4 border-t border-velora-border">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filters.inStock)}
            onChange={(e) => onChange({ ...filters, inStock: e.target.checked || undefined })}
            className="w-3.5 h-3.5 accent-velora-black"
          />
          <span className="text-xs text-neutral-700">In Stock Only</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.minRating === 4}
            onChange={(e) => onChange({ ...filters, minRating: e.target.checked ? 4 : undefined })}
            className="w-3.5 h-3.5 accent-velora-black"
          />
          <span className="text-xs text-neutral-700">4★ & Above Ratings</span>
        </label>
      </div>
    </div>
  );
};
