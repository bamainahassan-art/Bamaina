import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { PayNowButton } from '../components/PayNowButton';
import { ResilientImage } from '../components/ResilientImage';
import { formatNgn, useCart } from '../context/CartContext';
import { useSiteContent } from '../context/SiteContentContext';
import { PageRoute } from '../types/site';

interface CheckoutPageProps {
  onNavigate: (route: PageRoute, query?: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { content } = useSiteContent();
  const {
    serverProducts,
    loadingProducts,
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    getProductInfo,
    subtotalNgn,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMode, setPaymentMode] = useState<'live' | 'test' | 'simulation'>('test');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/payments/config')
      .then((r) => r.json())
      .then((data: { mode?: 'live' | 'test' | 'simulation' }) => {
        if (data.mode) setPaymentMode(data.mode);
      })
      .catch(() => {});
  }, []);

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (cartItems.length === 0) {
      setErrorMsg('Please add at least one agricultural product to your order.');
      return;
    }
    if (customerName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!/^[+\d\s()-]{7,20}$/.test(customerPhone.trim())) {
      setErrorMsg('Please enter a valid Nigerian or international phone number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      setErrorMsg('Please enter a valid email address for your payment receipt.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          items: cartItems.map((c) => ({
            productId: c.productId,
            quantity: c.quantity,
          })),
        }),
      });

      const data = (await response.json()) as {
        status?: boolean;
        error?: string;
        authorizationUrl?: string;
        reference?: string;
        mode?: 'live' | 'test' | 'simulation';
      };

      if (!response.ok || !data.status || !data.authorizationUrl) {
        setErrorMsg(data.error || 'Unable to initialize payment. Please try again.');
        setSubmitting(false);
        return;
      }

      if (data.mode === 'simulation' && data.reference) {
        onNavigate(
          'paystack-test-checkout',
          `reference=${encodeURIComponent(data.reference)}`
        );
        return;
      }

      // Redirect to Paystack hosted checkout URL
      window.location.href = data.authorizationUrl;
    } catch {
      setErrorMsg(
        'Network error while connecting to the payment server. Please check your connection and try again.'
      );
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-[#0E3B25] text-white py-14 border-b border-[#DFB14B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#DFB14B]">
            <span>{content.business.name}</span>
            <span aria-hidden="true">·</span>
            <span>Secure Paystack Checkout (NGN)</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            Order Review & Payment Checkout
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-2xl">
            Select livestock, poultry, or fish farming products, confirm quantities,
            and pay securely in Nigerian Naira (NGN) via Paystack.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-[#F4F7F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Quick Product Selector */}
          <div className="bg-white rounded-xl border border-[#0E3B25]/12 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#0E3B25]/10 pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-[#0E3B25]">
                  Select Agricultural Products
                </h2>
                <p className="text-xs text-[#354B3E]">
                  All prices are verified server-side in Nigerian Naira (NGN).
                </p>
              </div>
              <span className="text-xs font-semibold text-[#8A6110]">
                {paymentMode === 'live'
                  ? 'Paystack Live Gateway'
                  : paymentMode === 'test'
                    ? 'Paystack Test Mode Active'
                    : 'Paystack Test Sandbox Active'}
              </span>
            </div>

            {loadingProducts ? (
              <p className="text-sm text-[#354B3E] py-4">Loading farm catalog...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {serverProducts.map((product) => {
                  const inCart = cartItems.find((c) => c.productId === product.id);
                  return (
                    <div
                      key={product.id}
                      className="p-4 rounded-xl border border-[#0E3B25]/12 bg-[#F4F7F5]/50 flex flex-col justify-between gap-3"
                    >
                      <div className="flex gap-3 items-start">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#0E3B25]/10 bg-[#0E3B25] shrink-0">
                          <ResilientImage
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="text-xs font-medium text-[#8A6110] capitalize">
                            {product.division.replace('-', ' ')}
                          </p>
                          <h3 className="font-display text-sm font-bold text-[#0E3B25] leading-snug">
                            {product.name}
                          </h3>
                          <p className="text-sm font-bold text-[#0E3B25] tabular-nums">
                            {formatNgn(product.price_ngn)}{' '}
                            <span className="text-xs font-normal text-[#354B3E]">
                              / {product.unit_label}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#0E3B25]/8">
                        {inCart ? (
                          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E3B25]">
                            <CheckCircle2 className="w-4 h-4 text-[#145333]" />
                            <span>In Cart ({inCart.quantity})</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#354B3E]">
                            {product.availability}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => addToCart(product.id, 1)}
                          className="px-3 py-1.5 rounded-md bg-[#0E3B25] text-white text-xs font-semibold hover:bg-[#145333] cursor-pointer whitespace-nowrap"
                        >
                          {inCart ? '+ Add 1 More' : 'Add to Order'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Checkout Split: Order Items & Customer Form */}
          <form
            onSubmit={handlePayNow}
            noValidate
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Column: Cart Quantities & Customer Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Order Quantities */}
              <div className="bg-white rounded-xl border border-[#0E3B25]/12 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#0E3B25]/10 pb-3">
                  <h2 className="font-display text-xl font-bold text-[#0E3B25] flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#C8962E]" aria-hidden="true" />
                    <span>Your Selected Produce</span>
                  </h2>
                  <span className="text-xs font-semibold text-[#354B3E] tabular-nums">
                    {cartItems.length} product line(s)
                  </span>
                </div>

                {cartItems.length === 0 ? (
                  <p className="text-sm text-[#354B3E] py-4">
                    No products selected yet. Add any agricultural product above to proceed.
                  </p>
                ) : (
                  <div className="divide-y divide-[#0E3B25]/10">
                    {cartItems.map((line) => {
                      const product = getProductInfo(line.productId);
                      if (!product) return null;
                      return (
                        <div
                          key={line.productId}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-0.5">
                            <h3 className="font-display text-base font-bold text-[#0E3B25]">
                              {product.name}
                            </h3>
                            <p className="text-xs text-[#8A6110] font-medium tabular-nums">
                              {formatNgn(product.price_ngn)} ({product.unit_label})
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="inline-flex items-center border border-[#0E3B25]/20 rounded-lg bg-[#F4F7F5]">
                              <button
                                type="button"
                                aria-label={`Decrease ${product.name}`}
                                onClick={() =>
                                  updateQuantity(line.productId, line.quantity - 1)
                                }
                                className="w-9 h-9 flex items-center justify-center text-[#0E3B25] hover:bg-white rounded-l-lg cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                min={1}
                                max={500}
                                aria-label={`Quantity for ${product.name}`}
                                value={line.quantity}
                                onChange={(e) =>
                                  updateQuantity(
                                    line.productId,
                                    Math.max(
                                      1,
                                      parseInt(e.target.value || '1', 10)
                                    )
                                  )
                                }
                                className="w-14 text-center text-sm font-semibold text-[#0E3B25] bg-transparent tabular-nums focus:outline-none"
                              />
                              <button
                                type="button"
                                aria-label={`Increase ${product.name}`}
                                onClick={() =>
                                  updateQuantity(line.productId, line.quantity + 1)
                                }
                                className="w-9 h-9 flex items-center justify-center text-[#0E3B25] hover:bg-white rounded-r-lg cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="w-28 text-right text-sm font-bold text-[#0E3B25] tabular-nums">
                              {formatNgn(product.price_ngn * line.quantity)}
                            </span>

                            <button
                              type="button"
                              onClick={() => removeFromCart(line.productId)}
                              aria-label={`Remove ${product.name}`}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="bg-white rounded-xl border border-[#0E3B25]/12 p-6 space-y-5">
                <div className="border-b border-[#0E3B25]/10 pb-3">
                  <h2 className="font-display text-xl font-bold text-[#0E3B25]">
                    Customer Information
                  </h2>
                  <p className="text-xs text-[#354B3E] mt-0.5">
                    Required for your Paystack payment receipt and order coordination.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="block text-xs font-semibold text-[#0E3B25] mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#0E3B25]/20 text-sm focus:border-[#0E3B25]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="checkout-phone"
                        className="block text-xs font-semibold text-[#0E3B25] mb-1.5"
                      >
                        Phone Number *
                      </label>
                      <input
                        id="checkout-phone"
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 08065494739"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#0E3B25]/20 text-sm focus:border-[#0E3B25]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="checkout-email"
                        className="block text-xs font-semibold text-[#0E3B25] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="customer@example.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#0E3B25]/20 text-sm focus:border-[#0E3B25]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Pay Now */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-[#0E3B25]/15 p-6 space-y-5 lg:sticky lg:top-24">
              <div className="border-b border-[#0E3B25]/10 pb-3">
                <p className="text-xs font-semibold text-[#8A6110]">Order Review</p>
                <h2 className="font-display text-2xl font-bold text-[#0E3B25]">
                  Payment Summary
                </h2>
              </div>

              <div className="space-y-2.5 text-sm">
                {cartItems.map((line) => {
                  const product = getProductInfo(line.productId);
                  if (!product) return null;
                  return (
                    <div
                      key={line.productId}
                      className="flex justify-between gap-2 text-[#354B3E]"
                    >
                      <span className="truncate">
                        {product.name} × {line.quantity}
                      </span>
                      <span className="font-semibold text-[#0E3B25] tabular-nums shrink-0">
                        {formatNgn(product.price_ngn * line.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#0E3B25]/12 space-y-2 text-sm">
                <div className="flex justify-between text-[#354B3E]">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums">
                    {formatNgn(subtotalNgn)}
                  </span>
                </div>
                <div className="flex justify-between text-[#354B3E]">
                  <span>Currency</span>
                  <span className="font-semibold">NGN (Nigerian Naira)</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-[#0E3B25]/12">
                  <span className="font-display text-lg font-bold text-[#0E3B25]">
                    Order Total
                  </span>
                  <span className="font-display text-2xl font-bold text-[#0E3B25] tabular-nums">
                    {formatNgn(subtotalNgn)}
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <PayNowButton
                type="submit"
                size="lg"
                disabled={submitting || cartItems.length === 0}
                label={
                  submitting
                    ? 'Initializing Paystack...'
                    : `Pay Now · ${formatNgn(subtotalNgn)}`
                }
                className="w-full"
              />

              <div className="flex items-start gap-2.5 text-xs text-[#354B3E] pt-1">
                <ShieldCheck
                  className="w-4 h-4 text-[#0E3B25] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  Secured by Paystack. Final amounts are verified server-side before
                  checkout and upon webhook confirmation.
                </span>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
