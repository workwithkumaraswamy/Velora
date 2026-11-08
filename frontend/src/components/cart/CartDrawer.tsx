import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatINR } from '../../utils/formatters';
import { Button } from '../common/Button';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getSubtotal,
    getShippingFee,
    getTotal,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponInput.trim());
    setIsApplying(false);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      {/* Slide-out drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-velora-cream border-l border-velora-border shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-velora-border flex items-center justify-between bg-velora-cream">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-velora-black" />
            <h3 className="font-serif text-lg text-velora-black tracking-wide">
              Your Shopping Bag ({items.length})
            </h3>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 text-neutral-400 hover:text-velora-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-velora-ivory px-5 py-3 border-b border-velora-border text-xs">
          {amountNeededForFreeShipping > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-neutral-600">
                <span>
                  Add <strong className="text-velora-black font-semibold">{formatINR(amountNeededForFreeShipping)}</strong> more for complimentary shipping
                </span>
                <span className="font-mono text-[11px] text-velora-champagne-dark">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 overflow-hidden">
                <div
                  className="h-full bg-velora-champagne transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-emerald-700 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>You’ve unlocked Complimentary Express Shipping!</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-velora-border space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-velora-beige flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-velora-black">Your bag is empty</h4>
                <p className="text-xs text-neutral-500 font-light mt-1 max-w-xs">
                  Discover our sartorial curation and elevate your wardrobe today.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  closeDrawer();
                  navigate('/men');
                }}
              >
                Explore Collections
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex space-x-4">
                <img
                  src={
                    item.product.images?.find((img) => img.isPrimary)?.url ||
                    item.product.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&auto=format&fit=crop&q=80'
                  }
                  alt={item.product.title}
                  className="w-20 h-24 object-cover border border-velora-border flex-shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-medium text-velora-black line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-rose-600 ml-2"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {item.color} • Size: {item.size}
                    </p>
                    <p className="text-xs font-semibold text-velora-black mt-1">
                      {formatINR(item.unitPrice)}
                    </p>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center border border-velora-border bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-neutral-100 text-neutral-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-medium text-velora-black min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-neutral-100 text-neutral-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">
                      = {formatINR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-velora-border bg-velora-ivory space-y-4">
            {/* Promo code form */}
            {couponCode ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800">
                <div className="flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Promo applied: <strong className="font-semibold">{couponCode}</strong> (-{formatINR(discountAmount)})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-neutral-400 hover:text-neutral-700 underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-white border border-velora-border border-r-0 py-2 px-3 text-xs uppercase tracking-wider text-velora-black placeholder-neutral-400 focus:outline-none"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    isLoading={isApplying}
                    className="border-l-0"
                  >
                    Apply
                  </Button>
                </div>
                {couponMsg && (
                  <p
                    className={`text-[11px] mt-1 ${
                      couponMsg.isError ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </form>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-600 border-t border-velora-border pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-velora-black">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Offer Discount</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-medium">FREE</span>
                  ) : (
                    formatINR(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-velora-black pt-2 border-t border-velora-border">
                <span>Estimated Total</span>
                <span className="font-serif text-base">{formatINR(total)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <Button
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center tracking-widest text-xs"
              onClick={handleCheckoutClick}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed To Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
