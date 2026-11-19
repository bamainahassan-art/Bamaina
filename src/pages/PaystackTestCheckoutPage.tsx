import React, { useEffect, useState } from 'react';
import { Building2, CreditCard, Lock, ShieldAlert } from 'lucide-react';
import { formatNgn } from '../context/CartContext';
import { PageRoute, PaymentVerificationDTO } from '../types/site';

interface PaystackTestCheckoutPageProps {
  reference: string;
  onNavigate: (route: PageRoute, query?: string) => void;
}

export const PaystackTestCheckoutPage: React.FC<PaystackTestCheckoutPageProps> = ({
  reference,
  onNavigate,
}) => {
  const [details, setDetails] = useState<PaymentVerificationDTO | null>(null);
  const [channel, setChannel] = useState<'card' | 'bank_transfer'>('card');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) return;
    fetch(`/api/payments/verify/${encodeURIComponent(reference)}`)
      .then((r) => r.json())
      .then((data: PaymentVerificationDTO) => setDetails(data))
      .catch(() => setError('Unable to load transaction details.'));
  }, [reference]);

  const simulateOutcome = async (outcome: 'success' | 'pending' | 'failed') => {
    setProcessing(true);
    setError(null);
    try {
      const res = await fetch('/api/payments/test-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, outcome, channel }),
      });
      const data = (await res.json()) as {
        status?: string;
        reference?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || 'Simulation failed.');
        setProcessing(false);
        return;
      }

      if (outcome === 'success') {
        onNavigate(
          'payment-success',
          `reference=${encodeURIComponent(reference)}`
        );
      } else if (outcome === 'pending') {
        onNavigate(
          'payment-pending',
          `reference=${encodeURIComponent(reference)}`
        );
      } else {
        onNavigate(
          'payment-failed',
          `reference=${encodeURIComponent(reference)}`
        );
      }
    } catch {
      setError('Network error while contacting payment simulator.');
      setProcessing(false);
    }
  };

  const amountNgn = details?.order ? details.order.total_kobo / 100 : 0;

  return (
    <section className="py-16 bg-[#F4F7F5] min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#0E3B25]/20 shadow-xl overflow-hidden">
        <div className="bg-[#0E3B25] text-white p-6 flex items-center justify-between gap-4 border-b border-[#DFB14B]/40">
          <div>
            <p className="text-xs font-semibold text-[#DFB14B]">
              Paystack Test Sandbox Checkout
            </p>
            <h1 className="font-display text-xl font-bold">
              BAFFA NJANGIRDE AGRO-ALLIED FARM
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/70">Total</p>
            <p className="font-display text-2xl font-bold text-[#DFB14B] tabular-nums">
              {formatNgn(amountNgn)}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-3.5 rounded-lg bg-[#F4F7F5] border border-[#0E3B25]/12 text-xs text-[#354B3E] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#8A6110] shrink-0 mt-0.5" />
            <span>
              <strong>Test Sandbox Simulation:</strong> Because{' '}
              <code>PAYSTACK_SECRET_KEY</code> is not configured yet, this screen
              lets you test Card, Bank Transfer, Pending, and Failed flows with real
              HMAC-SHA512 signed webhook verification.
            </span>
          </div>

          {details?.order && (
            <div className="space-y-1 text-xs text-[#354B3E] border-b border-[#0E3B25]/10 pb-4">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-semibold text-[#0E3B25]">
                  {details.order.customer_email}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Reference:</span>
                <span className="font-mono font-semibold text-[#0E3B25]">
                  {details.order.payment_reference}
                </span>
              </div>
            </div>
          )}

          {/* Method Selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#0E3B25]">
              Select Payment Method
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setChannel('card')}
                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 text-xs font-semibold cursor-pointer ${
                  channel === 'card'
                    ? 'border-[#0E3B25] bg-[#F4F7F5] text-[#0E3B25]'
                    : 'border-[#0E3B25]/15 text-[#354B3E]'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#C8962E]" />
                <span>Card Payment</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('bank_transfer')}
                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 text-xs font-semibold cursor-pointer ${
                  channel === 'bank_transfer'
                    ? 'border-[#0E3B25] bg-[#F4F7F5] text-[#0E3B25]'
                    : 'border-[#0E3B25]/15 text-[#354B3E]'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#C8962E]" />
                <span>Bank Transfer</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              disabled={processing}
              onClick={() => simulateOutcome('success')}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[#0E3B25] text-[#DFB14B] border border-[#C8962E] font-semibold text-sm hover:bg-[#145333] disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>
                Simulate Successful{' '}
                {channel === 'card' ? 'Card Payment' : 'Bank Transfer'} (
                {formatNgn(amountNgn)})
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={processing}
                onClick={() => simulateOutcome('pending')}
                className="px-4 py-2.5 rounded-lg border border-[#C8962E] text-[#8A6110] text-xs font-semibold hover:bg-[#F4F7F5] cursor-pointer"
              >
                Simulate Pending
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={() => simulateOutcome('failed')}
                className="px-4 py-2.5 rounded-lg border border-red-300 text-red-700 text-xs font-semibold hover:bg-red-50 cursor-pointer"
              >
                Simulate Failed
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
