import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { formatINR } from '../utils/formatters';
import { Button } from '../components/common/Button';

export const WishlistPage: React.FC = () => {
  const { items, removeItem } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);

  const handleMoveToCart = (product: any) => {
    const defaultVariant = product.variants?.[0];
    const size = defaultVariant?.size || 'Standard';
    const color = defaultVariant?.color || 'Original';
    addItemToCart(product, size, color, 1, defaultVariant);
    removeItem(product.id);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-velora-beige mx-auto flex items-center justify-center text-neutral-400">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="font-serif text-3xl text-velora-black">Your Wishlist is Empty</h2>
        <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
          Save your most coveted sartorial pieces here to review and purchase at your convenience.
        </p>
        <div className="pt-4">
          <Link to="/men">
            <Button variant="primary" size="lg" className="tracking-widest">
              Explore Collections
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
          Saved Curations
        </span>
        <h1 className="font-serif text-3xl text-velora-black font-normal mt-0.5">
          My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => {
          const img =
            product.images?.find((i) => i.isPrimary)?.url ||
            product.images?.[0]?.url ||
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80';

          return (
            <div
              key={product.id}
              className="group bg-white border border-velora-border hover:border-velora-champagne/60 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-velora-beige">
                <img
                  src={img}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/80 hover:bg-white text-neutral-400 hover:text-rose-600 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                  {product.brand?.name || 'VÉLORA Atelier'}
                </span>
                <Link
                  to={`/product/${product.slug}`}
                  className="font-serif text-sm text-velora-black hover:text-velora-champagne-dark font-normal line-clamp-1"
                >
                  {product.title}
                </Link>
                <p className="font-semibold text-sm text-velora-black font-sans">
                  {formatINR(product.basePrice)}
                </p>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full tracking-wider"
                    onClick={() => handleMoveToCart(product)}
                    leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                  >
                    Move To Bag
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
