import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { formatNgn } from '../context/CartContext';
import { PaymentRecordDTO } from '../types/site';

export const PaymentRecordsPage: React.FC = () => {
  const [records, setRecords] = useState<PaymentRecordDTO[]>([]);
  const [mode, setMode] = useState<'live' | 'test' | 'simulation'>('simulation');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [recRes, cfgRes] = await Promise.all([
        fetch('/api/payments/records'),
        fetch('/api/payments/config'),
      ]);
      if (recRes.ok) {
        const data = (await recRes.json()) as { records?: PaymentRecordDTO[] };
        setRecords(data.records || []);
      }
      if (cfgRes.ok) {
        const cfg = (await cfgRes.json()) as {
          mode?: 'live' | 'test' | 'simulation';
        };
        if (cfg.mode) setMode(cfg.mode);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const webhookUrl = `${window.location.origin}/api/webhooks/paystack`;

  return (
    <div>
      {/* Header */}
      <section className="bg-[#0E3B25] text-white py-14 border-b border-[#DFB14B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#DFB14B]">
              BAFFA NJANGIRDE AGRO-ALLIED FARM · Paystack Administration
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold">
              Payment Records & Paystack Setup Guide
            </h1>
          </div>
          <div className="px-4 py-2 rounded-lg bg-white/10 border border-[#DFB14B]/50 text-xs font-semibold text-[#DFB14B] whitespace-nowrap">
            Gateway Mode:{' '}
            {mode === 'live'
              ? 'LIVE MODE'
              : mode === 'test'
                ? 'PAYSTACK TEST MODE'
                : 'LOCAL TEST SANDBOX'}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#F4F7F5] space-y-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Payment Records Table */}
          <div className="bg-white rounded-xl border border-[#0E3B25]/15 overflow-hidden">
            <div className="p-6 border-b border-[#0E3B25]/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0E3B25]">
                  Verified Payment Records Database
                </h2>
                <p className="text-xs text-[#354B3E]">
                  Stored server-side in SQLite (`payment_records` table). Orders are
                  marked paid only after API or webhook verification.
                </p>
              </div>
              <button
                type="button"
                onClick={loadData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0E3B25] text-white text-xs font-semibold hover:bg-[#145333] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#DFB14B]" />
                <span>Refresh Table</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F7F5] text-[#0E3B25] border-b border-[#0E3B25]/10">
                  <tr>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Transaction ID
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Payment Reference
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Customer Name
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Customer Email
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Customer Phone
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Order ID
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap text-right">
                      Amount
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Currency
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Method
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Transaction Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0E3B25]/10">
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-8 text-center text-[#354B3E]">
                        Loading payment records...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-8 text-center text-[#354B3E]">
                        No payment transactions recorded yet. Place a test order from
                        Checkout to verify end-to-end persistence.
                      </td>
                    </tr>
                  ) : (
                    records.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#F4F7F5]/60">
                        <td className="px-4 py-3 font-mono whitespace-nowrap">
                          {rec.transaction_id || '—'}
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-[#0E3B25] whitespace-nowrap">
                          {rec.payment_reference}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {rec.customer_name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {rec.customer_email}
                        </td>
                        <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                          {rec.customer_phone}
                        </td>
                        <td className="px-4 py-3 font-mono whitespace-nowrap">
                          {rec.order_id}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-[#0E3B25] tabular-nums whitespace-nowrap">
                          {formatNgn(rec.amount_ngn)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{rec.currency}</td>
                        <td className="px-4 py-3 capitalize whitespace-nowrap">
                          {rec.payment_method.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-3 font-semibold capitalize whitespace-nowrap">
                          <span
                            className={
                              rec.payment_status === 'success'
                                ? 'text-[#145333]'
                                : rec.payment_status === 'failed'
                                  ? 'text-red-700'
                                  : 'text-[#8A6110]'
                            }
                          >
                            {rec.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                          {new Date(rec.transaction_date).toLocaleString('en-NG')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Setup Guide */}
          <div className="bg-white rounded-xl border border-[#0E3B25]/15 p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-3 border-b border-[#0E3B25]/10 pb-4">
              <ShieldCheck className="w-6 h-6 text-[#0E3B25] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0E3B25]">
                  Paystack Configuration & Go-Live Guide
                </h2>
                <p className="text-sm text-[#354B3E]">
                  Follow these steps to connect your Paystack Test Keys first, verify
                  webhooks, and switch to Live Mode.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#354B3E]">
              <div className="p-5 rounded-xl bg-[#F4F7F5] border border-[#0E3B25]/12 space-y-2">
                <p className="text-xs font-bold text-[#8A6110]">
                  01. Enter Test Keys in Secrets
                </p>
                <p>
                  Open your AI Studio Secrets panel (or <code>.env</code> in local
                  hosting) and set:
                </p>
                <ul className="space-y-1 font-mono text-xs text-[#0E3B25] pt-1">
                  <li>PAYSTACK_SECRET_KEY=sk_test_...</li>
                  <li>PAYSTACK_PUBLIC_KEY=pk_test_...</li>
                  <li>PAYSTACK_WEBHOOK_SECRET=sk_test_...</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-[#F4F7F5] border border-[#0E3B25]/12 space-y-2">
                <p className="text-xs font-bold text-[#8A6110]">
                  02. Configure Webhook URL
                </p>
                <p>
                  In your Paystack Dashboard under{' '}
                  <strong>Settings → API Keys & Webhooks</strong>, set your Webhook
                  URL to:
                </p>
                <p className="font-mono text-xs bg-white p-2.5 rounded border border-[#0E3B25]/15 text-[#0E3B25] break-all">
                  {webhookUrl}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#F4F7F5] border border-[#0E3B25]/12 space-y-2">
                <p className="text-xs font-bold text-[#8A6110]">
                  03. Switch to Live Mode
                </p>
                <p>
                  After testing Card, Bank Transfer, Failed, and Duplicate Webhook
                  events in Test Mode, replace the keys with your Paystack{' '}
                  <code>sk_live_...</code> and <code>pk_live_...</code> keys, update the
                  Live Webhook URL, and restart the server.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
