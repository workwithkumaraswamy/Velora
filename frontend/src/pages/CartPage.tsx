import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag, Sparkles } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatINR } from '../utils/formatters';
import { Button } from '../components/common/Button';

export const CartPage: React.FC = () => {
  const {
    items,
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

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-velora-beige mx-auto flex items-center justify-center text-neutral-400">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="font-serif text-3xl text-velora-black">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
          Explore our premier menswear, haute gowns and artisanal kids' curations.
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
          Review & Finalize
        </span>
        <h1 className="font-serif text-3xl text-velora-black font-normal mt-0.5">
          Your Shopping Bag ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="bg-velora-beige/80 border border-velora-border p-4 text-xs">
        {amountNeededForFreeShipping > 0 ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              Add <strong className="font-semibold text-velora-black">{formatINR(amountNeededForFreeShipping)}</strong> more to your order to unlock complimentary express delivery.
            </span>
            <div className="w-full sm:w-48 h-2 bg-neutral-200 overflow-hidden">
              <div
                className="h-full bg-velora-champagne"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-emerald-800 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Complimentary Express Shipping has been unlocked for your order.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Line Items */}
        <div className="lg:col-span-8 border border-velora-border divide-y divide-velora-border bg-white">
          {items.map((item) => (
            <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex space-x-4">
                <img
                  src={
                    item.product.images?.find((img) => img.isPrimary)?.url ||
                    item.product.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={item.product.title}
                  className="w-24 h-32 object-cover border border-velora-border flex-shrink-0"
                />

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                    {item.product.brand?.name || 'VÉLORA Atelier'}
                  </span>
                  <h3 className="font-serif text-base text-velora-black font-normal">
                    {item.product.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-light">
                    Color: <span className="text-velora-black font-medium">{item.color}</span> • Size:{' '}
                    <span className="text-velora-black font-medium">{item.size}</span>
                  </p>
                  <p className="text-xs font-semibold text-velora-black pt-1">
                    {formatINR(item.unitPrice)}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4">
                <div className="flex items-center border border-velora-border bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-neutral-100 text-neutral-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-medium text-velora-black min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-neutral-100 text-neutral-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-sm text-velora-black font-sans">
                    {formatINR(item.unitPrice * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-neutral-400 hover:text-rose-600 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-velora-border p-6 space-y-5">
            <h3 className="font-serif text-lg text-velora-black font-normal pb-3 border-b border-velora-border">
              Order Summary
            </h3>

            {/* Promo Code Form */}
            {couponCode ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>
                    Offer <strong className="font-semibold">{couponCode}</strong> applied (-{formatINR(discountAmount)})
                  </span>
                </div>
                <button onClick={removeCoupon} className="underline text-neutral-500 hover:text-neutral-800">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black">
                  Promotional Voucher
                </label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-white border border-velora-border border-r-0 py-2.5 px-3 text-xs uppercase tracking-wider text-velora-black focus:outline-none"
                  />
                  <Button type="submit" variant="outline" size="sm" isLoading={isApplying} className="border-l-0">
                    Apply
                  </Button>
                </div>
                {couponMsg && (
                  <p className={`text-[11px] mt-1 ${couponMsg.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </form>
            )}

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-neutral-600 border-t border-velora-border pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-velora-black">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Voucher Discount</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Express Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    formatINR(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-velora-black border-t border-velora-border pt-3">
                <span>Payable Amount</span>
                <span className="font-serif text-lg">{formatINR(total)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/checkout')}
              className="w-full tracking-widest text-xs py-4"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed To Checkout
            </Button>
          </div>

          <div className="p-4 bg-velora-beige border border-velora-border space-y-2 text-xs text-neutral-600">
            <div className="flex items-center space-x-2 text-velora-black font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>VÉLORA Assurance</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Every parcel is dispatched with tamper-proof security seals and backed by 7-day concierge return policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
