import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import { Button } from '../components/common/Button';

export const CheckoutPage: React.FC = () => {
  const { items, getSubtotal, getShippingFee, getTotal, discountAmount, couponCode, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Multi-step state: 1 = Contact & Address, 2 = Payment & Review
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [customerInfo, setCustomerInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [address, setAddress] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    phone: user?.phone || '',
    houseNumber: '',
    street: '',
    area: '',
    city: '',
    state: 'Delhi',
    pincode: '',
    landmark: '',
    addressType: 'Home' as 'Home' | 'Office' | 'Other',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('RAZORPAY');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-velora-black">Your bag is empty</h2>
        <p className="text-xs text-neutral-500">Please select an item before proceeding to checkout.</p>
        <Link to="/men">
          <Button variant="primary">Shop Collections</Button>
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.firstName || !customerInfo.email || !customerInfo.phone) {
      setErrorMessage('Please provide complete customer contact details.');
      return;
    }
    if (!address.houseNumber || !address.street || !address.city || !address.pincode) {
      setErrorMessage('Please fill in complete street, house number, city and 6-digit PIN code.');
      return;
    }
    setErrorMessage(null);
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        customerInfo,
        shippingAddress: {
          ...address,
          fullName: address.fullName || `${customerInfo.firstName} ${customerInfo.lastName}`,
          phone: address.phone || customerInfo.phone,
        },
        items: items.map((it) => ({
          productId: it.productId,
          variantId: it.variantId,
          size: it.size,
          color: it.color,
          quantity: it.quantity,
        })),
        paymentMethod,
        couponCode: couponCode || undefined,
        customerNotes,
      };

      const res = await api.post('/orders/checkout', orderPayload);
      const { order, razorpay } = res.data.data;

      if (paymentMethod === 'RAZORPAY' && razorpay) {
        // Simulated Razorpay verification flow for seamless testing and instant completion
        const verifyRes = await api.post('/orders/verify-payment', {
          orderId: order.id,
          razorpayOrderId: razorpay.orderId,
          razorpayPaymentId: `pay_${Date.now()}`,
          razorpaySignature: 'test_sig_verified_luxury',
        });

        clearCart();
        navigate(`/order-confirmed/${order.orderNumber}`);
      } else {
        // COD Order
        clearCart();
        navigate(`/order-confirmed/${order.orderNumber}`);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || err.message || 'Unable to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-velora-border gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Secure Concierge Checkout
          </span>
          <h1 className="font-serif text-3xl text-velora-black font-normal mt-0.5">
            Finalize Your Purchase
          </h1>
        </div>

        {/* Progress Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs uppercase tracking-wider">
          <span className={`font-semibold ${step >= 1 ? 'text-velora-black' : 'text-neutral-400'}`}>
            1. Address
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className={`font-semibold ${step === 2 ? 'text-velora-black' : 'text-neutral-400'}`}>
            2. Payment & Confirm
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form Column (Steps 1 & 2) */}
        <div className="lg:col-span-8">
          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-8">
              {/* Customer Contact */}
              <div className="bg-white border border-velora-border p-6 space-y-4">
                <h3 className="font-serif text-lg text-velora-black font-normal pb-3 border-b border-velora-border">
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                      className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                      className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                      Email Address (For Order Receipts) *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                      Mobile Number (For Delivery SMS / OTP) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white border border-velora-border p-6 space-y-4">
                <h3 className="font-serif text-lg text-velora-black font-normal pb-3 border-b border-velora-border">
                  2. Shipping & Delivery Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Verma"
                      value={address.fullName || `${customerInfo.firstName} ${customerInfo.lastName}`}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                      House / Flat / Villa Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Villa 14 or Flat 402"
                      value={address.houseNumber}
                      onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })}
                      className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                      Street / Road *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Golf Course Road"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                      Area / Locality *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DLF Phase 5"
                      value={address.area}
                      onChange={(e) => setAddress({ ...address, area: e.target.value })}
                      className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gurugram"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Haryana"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                      6-Digit PIN Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="122002"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Near Horizon Club"
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-2">
                      Address Type
                    </label>
                    <div className="flex space-x-4">
                      {['Home', 'Office', 'Other'].map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="addressType"
                            checked={address.addressType === type}
                            onChange={() => setAddress({ ...address, addressType: type as any })}
                            className="accent-velora-black"
                          />
                          <span className="text-xs">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="lg" className="tracking-widest" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue To Payment
                </Button>
              </div>
            </form>
          ) : (
            /* STEP 2: Payment & Final Review */
            <div className="space-y-8">
              {/* Selected Address Summary */}
              <div className="bg-white border border-velora-border p-6 flex items-start justify-between">
                <div>
                  <h4 className="font-serif text-base text-velora-black font-normal">
                    Deliver To: {address.fullName || `${customerInfo.firstName} ${customerInfo.lastName}`}
                  </h4>
                  <p className="text-xs text-neutral-600 font-light mt-1">
                    {address.houseNumber}, {address.street}, {address.area}, {address.city}, {address.state} — {address.pincode}
                  </p>
                  <p className="text-xs text-neutral-500 font-light mt-0.5">
                    Phone: {customerInfo.phone} • Email: {customerInfo.email}
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-velora-champagne-dark hover:underline uppercase tracking-wider font-medium"
                >
                  Edit Address
                </button>
              </div>

              {/* Payment Methods */}
              <div className="bg-white border border-velora-border p-6 space-y-5">
                <h3 className="font-serif text-lg text-velora-black font-normal pb-3 border-b border-velora-border">
                  Select Payment Method
                </h3>

                <div className="space-y-3">
                  {/* Razorpay Online */}
                  <label
                    className={`flex items-start p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'RAZORPAY'
                        ? 'border-velora-black bg-velora-ivory/60 ring-1 ring-velora-black'
                        : 'border-velora-border bg-white hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                      className="mt-1 accent-velora-black"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-velora-black flex items-center space-x-1.5">
                          <CreditCard className="w-4 h-4 text-velora-champagne-dark" />
                          <span>Razorpay Online Gateway (Instant & Secure)</span>
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-semibold uppercase">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-light mt-1">
                        Pay with UPI (GPay, PhonePe, Paytm), Credit/Debit Card, NetBanking or Wallets. Protected with 256-bit SSL encryption.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-velora-black bg-velora-ivory/60 ring-1 ring-velora-black'
                        : 'border-velora-border bg-white hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-1 accent-velora-black"
                    />
                    <div className="ml-3 flex-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-velora-black flex items-center space-x-1.5">
                        <Banknote className="w-4 h-4 text-velora-champagne-dark" />
                        <span>Cash on Delivery (COD)</span>
                      </span>
                      <p className="text-xs text-neutral-500 font-light mt-1">
                        Pay in cash or through UPI QR code upon doorstep receipt of your parcel.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Special Instructions */}
                <div className="pt-2">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                    Delivery Instructions / Concierge Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Please call before arrival or leave with lobby security"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="md" onClick={() => setStep(1)}>
                  ← Back to Address
                </Button>
                <Button
                  variant="champagne"
                  size="lg"
                  isLoading={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="tracking-widest py-4 px-8 text-xs font-semibold"
                >
                  Confirm & Place Order ({formatINR(total)})
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Review */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-velora-border p-6 space-y-4">
            <h3 className="font-serif text-lg text-velora-black font-normal pb-3 border-b border-velora-border">
              Order Breakdown
            </h3>

            {/* Item snippets */}
            <div className="divide-y divide-velora-border max-h-64 overflow-y-auto no-scrollbar space-y-3">
              {items.map((it) => (
                <div key={it.id} className="pt-3 first:pt-0 flex items-center space-x-3 text-xs">
                  <img
                    src={
                      it.product.images?.find((img) => img.isPrimary)?.url ||
                      it.product.images?.[0]?.url ||
                      ''
                    }
                    alt={it.product.title}
                    className="w-12 h-16 object-cover border border-velora-border flex-shrink-0"
                  />
                  <div className="flex-1 truncate">
                    <p className="font-medium text-velora-black truncate">{it.product.title}</p>
                    <p className="text-[11px] text-neutral-400">
                      {it.size} • {it.color} • Qty {it.quantity}
                    </p>
                    <p className="font-semibold text-neutral-700">{formatINR(it.unitPrice * it.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-velora-border space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-velora-black">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Offer Discount ({couponCode})</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : formatINR(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-velora-black pt-3 border-t border-velora-border">
                <span>Total Payable</span>
                <span className="font-serif text-lg">{formatINR(total)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-velora-beige border border-velora-border space-y-2 text-[11px] text-neutral-600">
            <div className="flex items-center space-x-1.5 text-velora-black font-semibold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-velora-champagne-dark" />
              <span>Bank-Grade Encryption</span>
            </div>
            <p className="leading-relaxed">
              Your transactional data is safeguarded with end-to-end security protocols. We do not store financial card numbers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
