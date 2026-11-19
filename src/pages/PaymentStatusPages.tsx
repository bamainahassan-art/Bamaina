import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  Printer,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { formatNgn, useCart } from '../context/CartContext';
import { useSiteContent } from '../context/SiteContentContext';
import { PageRoute, PaymentVerificationDTO } from '../types/site';

interface PaymentStatusPagesProps {
  route: 'payment-success' | 'payment-failed' | 'payment-pending';
  reference: string;
  onNavigate: (route: PageRoute, query?: string) => void;
}

export const PaymentStatusPages: React.FC<PaymentStatusPagesProps> = ({
  route,
  reference,
  onNavigate,
}) => {
  const { content, buildWhatsAppLink } = useSiteContent();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<PaymentVerificationDTO | null>(
    null
  );
  const [confirmingTest, setConfirmingTest] = useState(false);

  const verifyNow = useCallback(async () => {
    if (!reference) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/payments/verify/${encodeURIComponent(reference)}`
      );
      const data = (await res.json()) as PaymentVerificationDTO;
      setVerification(data);
      if (data.verified && data.status === 'success') {
        clearCart();
      }
    } catch {
      setVerification({
        verified: false,
        status: route === 'payment-failed' ? 'failed' : 'pending',
        message: 'Could not reach verification server. Please try again.',
        mode: 'test',
      });
    } finally {
      setLoading(false);
    }
  }, [reference, route, clearCart]);

  useEffect(() => {
    verifyNow();
  }, [verifyNow]);

  const confirmSimulatedPending = async () => {
    if (!reference) return;
    setConfirmingTest(true);
    try {
      await fetch('/api/payments/test-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          outcome: 'success',
          channel: 'bank_transfer',
        }),
      });
      await verifyNow();
    } finally {
      setConfirmingTest(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-[#F4F7F5] min-h-[65vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#0E3B25]/15 p-10 max-w-md w-full text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-[#0E3B25] animate-spin mx-auto" />
          <h1 className="font-display text-2xl font-bold text-[#0E3B25]">
            Verifying Payment with Paystack
          </h1>
          <p className="text-sm text-[#354B3E]">
            Please wait while we confirm transaction reference{' '}
            <span className="font-mono font-semibold">{reference || '—'}</span>.
          </p>
        </div>
      </section>
    );
  }

  // Strictly determine displayed state from SERVER verification, never URL path alone!
  const effectiveStatus: 'success' | 'pending' | 'failed' = verification
    ? verification.verified && verification.status === 'success'
      ? 'success'
      : verification.status === 'failed'
        ? 'failed'
        : 'pending'
    : route === 'payment-failed'
      ? 'failed'
      : 'pending';

  const order = verification?.order;
  const payment = verification?.payment;
  const items = verification?.items || [];

  if (effectiveStatus === 'success' && order && payment) {
    return (
      <section className="py-14 lg:py-20 bg-[#F4F7F5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="bg-white rounded-2xl border border-[#0E3B25]/15 overflow-hidden shadow-sm">
            <div className="bg-[#0E3B25] text-white p-8 text-center space-y-3 border-b border-[#DFB14B]/40">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#DFB14B]/20 border border-[#DFB14B] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#DFB14B]" />
              </div>
              <p className="text-xs font-semibold text-[#DFB14B]">
                Paystack Verification Confirmed
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">
                Payment Successful
              </h1>
              <p className="text-sm text-white/85 max-w-lg mx-auto">
                Thank you, {order.customer_name}. Your payment to{' '}
                {content.business.name} has been verified and recorded.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-[#F4F7F5] p-5 rounded-xl border border-[#0E3B25]/10">
                <div>
                  <p className="text-xs text-[#8A6110] font-semibold">Order ID</p>
                  <p className="font-mono font-bold text-[#0E3B25]">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A6110] font-semibold">
                    Payment Reference
                  </p>
                  <p className="font-mono font-bold text-[#0E3B25]">
                    {payment.payment_reference}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A6110] font-semibold">
                    Transaction ID
                  </p>
                  <p className="font-mono font-semibold text-[#0E3B25]">
                    {payment.transaction_id || 'Verified'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A6110] font-semibold">
                    Payment Method
                  </p>
                  <p className="font-semibold text-[#0E3B25] capitalize">
                    {payment.payment_method.replace('_', ' ')} ({payment.currency})
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A6110] font-semibold">Customer</p>
                  <p className="font-semibold text-[#0E3B25]">
                    {order.customer_name} · {order.customer_phone}
                  </p>
                  <p className="text-xs text-[#354B3E]">{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A6110] font-semibold">Date</p>
                  <p className="font-semibold text-[#0E3B25]">
                    {new Date(payment.transaction_date).toLocaleString('en-NG')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="font-display text-lg font-bold text-[#0E3B25]">
                  Order Breakdown
                </h2>
                <div className="border border-[#0E3B25]/12 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F4F7F5] text-xs text-[#0E3B25]">
                      <tr>
                        <th className="text-left px-4 py-2.5 font-semibold">Item</th>
                        <th className="text-right px-4 py-2.5 font-semibold">Qty</th>
                        <th className="text-right px-4 py-2.5 font-semibold">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0E3B25]/10">
                      {items.map((item) => (
                        <tr key={item.productId}>
                          <td className="px-4 py-3 font-medium text-[#0E3B25]">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums">
                            {formatNgn(item.lineTotalKobo / 100)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#0E3B25] text-white">
                      <tr>
                        <td colSpan={2} className="px-4 py-3 font-semibold">
                          Total Paid (NGN)
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-[#DFB14B] tabular-nums">
                          {formatNgn(payment.amount_ngn)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#0E3B25]/25 text-sm font-semibold text-[#0E3B25] hover:bg-[#F4F7F5] cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Receipt</span>
                  </button>
                  <a
                    href={buildWhatsAppLink(
                      `Hello ${content.business.name}, my payment is confirmed.\nOrder ID: ${order.id}\nReference: ${payment.payment_reference}\nAmount: ${formatNgn(payment.amount_ngn)}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0E3B25] text-[#DFB14B] border border-[#C8962E] text-sm font-semibold hover:bg-[#145333]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Share Receipt on WhatsApp</span>
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="text-sm font-semibold text-[#0E3B25] hover:text-[#8A6110] cursor-pointer"
                >
                  Return Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (effectiveStatus === 'pending') {
    return (
      <section className="py-16 lg:py-24 bg-[#F4F7F5] min-h-[65vh] flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-2xl border border-[#C8962E]/50 overflow-hidden shadow-sm">
          <div className="bg-[#0E3B25] text-white p-8 text-center space-y-3 border-b border-[#DFB14B]/40">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#DFB14B]/20 border border-[#DFB14B] flex items-center justify-center">
              <Clock className="w-8 h-8 text-[#DFB14B]" />
            </div>
            <p className="text-xs font-semibold text-[#DFB14B]">
              Awaiting Confirmation
            </p>
            <h1 className="font-display text-3xl font-bold">Payment Pending</h1>
          </div>

          <div className="p-6 sm:p-8 space-y-5 text-sm text-[#354B3E]">
            <p>
              {verification?.message ||
                'Your transaction has not yet been confirmed by Paystack. If you paid via bank transfer, confirmation may take a short moment.'}
            </p>

            {reference && (
              <div className="p-4 rounded-xl bg-[#F4F7F5] border border-[#0E3B25]/12 space-y-1">
                <p className="text-xs font-semibold text-[#8A6110]">
                  Transaction Reference
                </p>
                <p className="font-mono font-bold text-[#0E3B25]">{reference}</p>
                {order && (
                  <p className="text-xs text-[#354B3E] tabular-nums">
                    Order Total: {formatNgn(order.total_kobo / 100)} (NGN)
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={verifyNow}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0E3B25] text-[#DFB14B] border border-[#C8962E] text-sm font-semibold hover:bg-[#145333] cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Verify Payment Status Now</span>
              </button>

              {verification?.mode === 'simulation' && reference && (
                <button
                  type="button"
                  disabled={confirmingTest}
                  onClick={confirmSimulatedPending}
                  className="px-4 py-3 rounded-lg border border-[#0E3B25]/25 text-xs font-semibold text-[#0E3B25] hover:bg-[#F4F7F5] cursor-pointer"
                >
                  {confirmingTest
                    ? 'Confirming...'
                    : 'Test Mode: Simulate Transfer Received'}
                </button>
              )}

              <a
                href={buildWhatsAppLink(
                  `Hello ${content.business.name}, my payment reference ${reference} is showing pending.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-[#0E3B25]/25 text-sm font-semibold text-[#0E3B25] hover:bg-[#F4F7F5]"
              >
                <MessageCircle className="w-4 h-4 text-[#C8962E]" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Failed State
  return (
    <section className="py-16 lg:py-24 bg-[#F4F7F5] min-h-[65vh] flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-red-200 overflow-hidden shadow-sm">
        <div className="bg-[#0E3B25] text-white p-8 text-center space-y-3 border-b border-[#DFB14B]/40">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-500/20 border border-red-300 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-200" />
          </div>
          <p className="text-xs font-semibold text-[#DFB14B]">
            Transaction Not Completed
          </p>
          <h1 className="font-display text-3xl font-bold">Payment Failed</h1>
        </div>

        <div className="p-6 sm:p-8 space-y-5 text-sm text-[#354B3E]">
          <p>
            {verification?.message ||
              'Your payment could not be completed or verified. No order has been marked as paid.'}
          </p>

          {reference && (
            <div className="p-4 rounded-xl bg-[#F4F7F5] border border-[#0E3B25]/12 space-y-1">
              <p className="text-xs font-semibold text-[#8A6110]">Reference</p>
              <p className="font-mono font-bold text-[#0E3B25]">{reference}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('checkout')}
              className="px-5 py-3 rounded-lg bg-[#0E3B25] text-[#DFB14B] border border-[#C8962E] text-sm font-semibold hover:bg-[#145333] cursor-pointer"
            >
              Return to Checkout & Retry
            </button>
            <a
              href={buildWhatsAppLink(
                `Hello ${content.business.name}, I need assistance with payment reference ${reference || 'N/A'}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-[#0E3B25]/25 text-sm font-semibold text-[#0E3B25] hover:bg-[#F4F7F5]"
            >
              <MessageCircle className="w-4 h-4 text-[#C8962E]" />
              <span>Contact on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
