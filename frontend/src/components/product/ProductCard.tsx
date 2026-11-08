import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../utils/formatters';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const isWishlisted = isInWishlist(product.id);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80';

  const secondaryImage =
    product.images?.[1]?.url || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants?.[0];
    const size = defaultVariant?.size || 'Standard';
    const color = defaultVariant?.color || 'Original';
    addItemToCart(product, size, color, 1, defaultVariant);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <div className="group relative flex flex-col bg-velora-cream border border-velora-border hover:border-velora-champagne/60 transition-all duration-300">
      {/* Product Image Container */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-velora-beige block">
        {/* Primary & Secondary Hover Image */}
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          loading="lazy"
        />
        <img
          src={secondaryImage}
          alt={product.title}
          className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges: Discount or New */}
        <div className="absolute top-2.5 left-2.5 flex flex-col space-y-1 z-10">
          {product.discountPercentage > 0 && (
            <span className="bg-velora-black text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-velora-champagne text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-colors z-10 ${
            isWishlisted
              ? 'bg-velora-black text-rose-500'
              : 'bg-white/80 backdrop-blur-sm text-velora-black hover:bg-white hover:text-rose-500'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-white text-velora-black text-[11px] font-semibold uppercase tracking-widest hover:bg-velora-black hover:text-white transition-colors flex items-center justify-center space-x-1.5 shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
        <div>
          {/* Brand */}
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium block">
            {product.brand?.name || 'VÉLORA Atelier'}
          </span>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="font-serif text-sm text-velora-black hover:text-velora-champagne-dark transition-colors line-clamp-1 mt-0.5 font-normal"
          >
            {product.title}
          </Link>
        </div>

        {/* Available Sizes Preview */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex items-center space-x-1 overflow-x-auto py-0.5 text-[10px] text-neutral-500 no-scrollbar">
            <span className="text-[9px] uppercase tracking-wider text-neutral-400">Sizes:</span>
            {product.variants.slice(0, 4).map((v) => (
              <span
                key={v.id}
                className="px-1 py-0.5 border border-velora-border text-neutral-600 bg-white"
              >
                {v.size}
              </span>
            ))}
            {product.variants.length > 4 && (
              <span className="text-[9px] text-neutral-400">+{product.variants.length - 4}</span>
            )}
          </div>
        )}

        {/* Price & Rating */}
        <div className="pt-1 border-t border-velora-border/60 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-semibold text-sm text-velora-black font-sans">
              {formatINR(product.basePrice)}
            </span>
            {product.mrp > product.basePrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatINR(product.mrp)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.averageRating > 0 && (
            <div className="flex items-center space-x-1 text-xs text-neutral-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-[11px]">{product.averageRating}</span>
              <span className="text-[10px] text-neutral-400">({product.reviewCount})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
