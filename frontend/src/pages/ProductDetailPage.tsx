import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  RefreshCw, 
  ShieldCheck, 
  Ruler, 
  Check, 
  MapPin, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { ImageGallery } from '../components/product/ImageGallery';
import { SizeGuideModal } from '../components/product/SizeGuideModal';
import { ReviewSection } from '../components/product/ReviewSection';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'specifications' | 'care' | 'provenance'>('details');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Delivery Pincode Checker
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  const addItemToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        const p: Product = res.data.data;
        setProduct(p);

        if (p.variants && p.variants.length > 0) {
          const firstInStock = p.variants.find((v) => v.stock > 0) || p.variants[0];
          setSelectedVariant(firstInStock);
          setSelectedSize(firstInStock.size);
          setSelectedColor(firstInStock.color);
        }

        // Fetch related products from same department
        const relatedRes = await api.get(`/products?department=${p.department?.slug || 'men'}&limit=4`);
        const related = (relatedRes.data.data || []).filter((it: Product) => it.id !== p.id);
        setRelatedProducts(related.slice(0, 4));
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const currentStock = selectedVariant ? selectedVariant.stock : product.totalStock;
  const isOutOfStock = currentStock <= 0;

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
    const matchingVariant = product.variants?.find(
      (v) => v.size === size && (selectedColor ? v.color === selectedColor : true)
    );
    if (matchingVariant) setSelectedVariant(matchingVariant);
  };

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    const matchingVariant = product.variants?.find(
      (v) => v.color === color && (selectedSize ? v.size === selectedSize : true)
    );
    if (matchingVariant) setSelectedVariant(matchingVariant);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItemToCart(product, selectedSize || 'Standard', selectedColor || 'Original', quantity, selectedVariant || undefined);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItemToCart(product, selectedSize || 'Standard', selectedColor || 'Original', quantity, selectedVariant || undefined);
    navigate('/checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode)) {
      const deliveryDate = new Date(Date.now() + 86400000 * 3);
      const formatted = new Intl.DateTimeFormat('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }).format(deliveryDate);
      setPincodeStatus(`Available! Express courier delivery by ${formatted} to PIN ${pincode}. Cash on Delivery eligible.`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian postal code.');
    }
  };

  // Unique sizes and colors
  const availableSizes = Array.from(new Set(product.variants?.map((v) => v.size) || []));
  const availableColors = Array.from(new Set(product.variants?.map((v) => v.color) || []));

  return (
    <div className="space-y-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[11px] text-neutral-400 uppercase tracking-widest pb-6">
          <Link to="/" className="hover:text-velora-black transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/${product.department?.slug || 'men'}`} className="hover:text-velora-black transition-colors">
            {product.department?.name || 'Department'}
          </Link>
          <span>/</span>
          <Link to={`/${product.department?.slug || 'men'}?category=${product.category?.slug}`} className="hover:text-velora-black transition-colors">
            {product.category?.name || 'Category'}
          </Link>
          <span>/</span>
          <span className="text-velora-black font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Stage: Image Gallery & Buying Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.images || []} title={product.title} />
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Brand and Provenance */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-semibold">
                  {product.brand?.name || 'Atelier VÉLORA'}
                </span>

                {product.isFeatured && (
                  <span className="text-[10px] uppercase tracking-widest text-velora-champagne-dark font-medium flex items-center">
                    <Sparkles className="w-3 h-3 mr-1 text-velora-champagne" />
                    <span>Curator’s Choice</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl text-velora-black font-normal tracking-wide mt-1.5 leading-snug">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(product.averageRating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-velora-black">
                  {product.averageRating ? product.averageRating.toFixed(1) : '5.0'}
                </span>
                <span className="text-neutral-400 text-xs">({product.reviewCount || 1} verified appraisals)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-velora-ivory border border-velora-border flex items-baseline space-x-3">
              <span className="font-serif text-3xl font-medium text-velora-black">
                {formatINR(product.basePrice)}
              </span>
              {product.mrp > product.basePrice && (
                <>
                  <span className="text-sm text-neutral-400 line-through">
                    {formatINR(product.mrp)}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2 py-0.5">
                    Save {product.discountPercentage}%
                  </span>
                </>
              )}
              <span className="text-[10px] text-neutral-400 tracking-wider uppercase ml-auto">
                Inclusive of all taxes
              </span>
            </div>

            {/* Color Swatch Selector */}
            {availableColors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-velora-black">
                    Color: <strong className="font-normal text-neutral-600">{selectedColor}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {availableColors.map((clr) => {
                    const isSelected = selectedColor === clr;
                    return (
                      <button
                        key={clr}
                        onClick={() => handleColorClick(clr)}
                        className={`px-3 py-1.5 text-xs border font-medium transition-all ${
                          isSelected
                            ? 'border-velora-black bg-velora-black text-white'
                            : 'border-velora-border bg-white text-neutral-700 hover:border-black'
                        }`}
                      >
                        {clr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-velora-black">
                    Select Size: <strong className="font-normal text-neutral-600">{selectedSize}</strong>
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center space-x-1 text-velora-champagne-dark hover:underline font-medium"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Sartorial Size Guide</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {availableSizes.map((sz) => {
                    const variantForSize = product.variants?.find((v) => v.size === sz);
                    const isOut = variantForSize ? variantForSize.stock <= 0 : false;
                    const isSelected = selectedSize === sz;

                    return (
                      <button
                        key={sz}
                        disabled={isOut}
                        onClick={() => handleSizeClick(sz)}
                        className={`py-2.5 text-xs font-medium border text-center transition-all ${
                          isOut
                            ? 'opacity-40 line-through bg-neutral-100 border-neutral-200 cursor-not-allowed'
                            : isSelected
                            ? 'border-velora-black bg-velora-black text-white'
                            : 'border-velora-border bg-white text-neutral-800 hover:border-black'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inventory Status */}
            <div className="text-xs">
              {isOutOfStock ? (
                <span className="text-rose-600 font-semibold uppercase tracking-wider">
                  Currently Out of Stock
                </span>
              ) : currentStock <= 5 ? (
                <span className="text-amber-700 font-medium">
                  ⚡ Only {currentStock} pieces left in atelier reserve — order promptly
                </span>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>In Stock & Ready for Rapid Dispatch</span>
                </span>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                  className="w-full tracking-widest text-xs"
                >
                  Add To Bag
                </Button>
                <Button
                  variant="champagne"
                  size="lg"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full tracking-widest text-xs"
                >
                  Buy Now
                </Button>
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={() => toggleItem(product)}
                className={`w-full tracking-wider ${isWishlisted ? 'text-rose-600 border-rose-300' : ''}`}
                leftIcon={<Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />}
              >
                {isWishlisted ? 'Saved in Your Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="pt-4 border-t border-velora-border space-y-2">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-velora-black">
                Delivery & Availability Checker
              </span>
              <form onSubmit={handlePincodeCheck} className="flex">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN code (e.g. 110001)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-white border border-velora-border border-r-0 py-2 pl-9 pr-3 text-xs text-velora-black focus:outline-none"
                  />
                </div>
                <Button type="submit" variant="outline" size="sm" className="border-l-0">
                  Check
                </Button>
              </form>
              {pincodeStatus && (
                <p className="text-[11px] text-neutral-600 font-light mt-1 bg-velora-ivory p-2 border border-velora-border">
                  {pincodeStatus}
                </p>
              )}
            </div>

            {/* Value Guarantees */}
            <div className="pt-4 border-t border-velora-border grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-wider text-neutral-600">
              <div className="p-2 bg-velora-beige/60">
                <Truck className="w-4 h-4 mx-auto mb-1 text-velora-champagne-dark" />
                <span>Express Dispatch</span>
              </div>
              <div className="p-2 bg-velora-beige/60">
                <RefreshCw className="w-4 h-4 mx-auto mb-1 text-velora-champagne-dark" />
                <span>7-Day Return</span>
              </div>
              <div className="p-2 bg-velora-beige/60">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-velora-champagne-dark" />
                <span>100% Authentic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Overview, Specifications, Care, Provenance */}
        <div className="mt-16 pt-10 border-t border-velora-border">
          <div className="flex border-b border-velora-border space-x-6 overflow-x-auto no-scrollbar">
            {[
              { id: 'details', label: 'Product Narrative' },
              { id: 'specifications', label: 'Specifications & Fit' },
              { id: 'care', label: 'Material & Care' },
              { id: 'provenance', label: 'Supplier & Provenance' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs uppercase tracking-widest font-semibold transition-colors flex-shrink-0 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-velora-black text-velora-black'
                    : 'border-transparent text-neutral-400 hover:text-velora-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8 max-w-3xl text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <p>{product.description}</p>
                {product.highlights && product.highlights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold uppercase tracking-widest text-xs text-velora-black">
                      Sartorial Highlights
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                      {product.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="border border-velora-border divide-y divide-velora-border">
                {product.specifications && Object.entries(product.specifications).length > 0 ? (
                  Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 p-3">
                      <span className="font-semibold text-velora-black">{key}</span>
                      <span className="col-span-2 text-neutral-600">{val}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-neutral-500">Standard specifications apply.</div>
                )}
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4">
                <h4 className="font-semibold uppercase tracking-widest text-xs text-velora-black">
                  Preservation Instructions
                </h4>
                <p>{product.careInstructions || 'Dry clean only with specialist solvent. Store in a cool, dry garment bag.'}</p>
              </div>
            )}

            {activeTab === 'provenance' && (
              <div className="space-y-4">
                <h4 className="font-semibold uppercase tracking-widest text-xs text-velora-black">
                  Artisan Provenance & Ethical Sourcing
                </h4>
                <p>
                  Sourced through authorized dropshipping partner {product.supplier?.name || 'Vogue Craft Logistics Ltd.'}. Every raw material batch is certified for ethical labor standards and authentic weave certification.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <ReviewSection productId={product.id} />

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-velora-border space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
                  Complementary Sartorial
                </span>
                <h3 className="font-serif text-2xl text-velora-black font-normal mt-0.5">
                  You May Also Admire
                </h3>
              </div>
              <Link
                to={`/${product.department?.slug || 'men'}`}
                className="text-xs uppercase tracking-widest font-semibold text-velora-black hover:text-velora-champagne-dark flex items-center"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sizing Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category?.slug}
      />
    </div>
  );
};
