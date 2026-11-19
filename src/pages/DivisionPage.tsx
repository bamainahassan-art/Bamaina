import React, { useState } from 'react';
import {
  Check,
  MessageCircle,
  Minus,
  Pencil,
  Phone,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import { EditableSectionWrapper } from '../components/EditableSectionBar';
import { PayNowButton } from '../components/PayNowButton';
import { ResilientImage } from '../components/ResilientImage';
import { formatNgn, useCart } from '../context/CartContext';
import { useSiteContent } from '../context/SiteContentContext';
import { DivisionKey, PageRoute } from '../types/site';

interface DivisionPageProps {
  divisionKey: DivisionKey;
  onNavigate: (route: PageRoute) => void;
}

export const DivisionPage: React.FC<DivisionPageProps> = ({
  divisionKey,
  onNavigate,
}) => {
  const { content, isEditMode, openEditor, buildWhatsAppLink } = useSiteContent();
  const {
    serverProducts,
    addToCart,
    openCart,
    itemCount,
    subtotalNgn,
  } = useCart();

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const division = content.divisions[divisionKey];
  const { business, products } = content;

  // Prefer live server products for trusted NGN pricing; fall back to local catalog if needed
  const serverDivProducts = serverProducts.filter(
    (p) => p.division === divisionKey
  );
  const displayProducts =
    serverDivProducts.length > 0
      ? serverDivProducts.map((sp) => ({
          id: sp.id,
          division: sp.division,
          name: sp.name,
          description: sp.description,
          availability: sp.availability,
          imageUrl: sp.image_url,
          priceNgn: sp.price_ngn,
          unitLabel: sp.unit_label,
        }))
      : products.filter((p) => p.division === divisionKey);

  const getQty = (id: string) => quantities[id] || 1;
  const setQty = (id: string, val: number) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, Math.min(500, Math.floor(val || 1))),
    }));

  const handlePayNowProduct = (productId: string) => {
    addToCart(productId, getQty(productId));
    onNavigate('checkout');
  };

  const tabs: { key: DivisionKey; label: string }[] = [
    { key: 'livestock', label: 'Livestock Farming' },
    { key: 'poultry', label: 'Poultry Farming' },
    { key: 'fish-farming', label: 'Fish Farming' },
  ];

  return (
    <div>
      {/* Division Sub-Navigation Strip */}
      <div className="bg-[#F4F7F5] border-b border-[#0E3B25]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => onNavigate(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  divisionKey === tab.key
                    ? 'bg-[#0E3B25] text-white'
                    : 'bg-white text-[#2A4135] border border-[#0E3B25]/15 hover:text-[#0E3B25]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#0E3B25]/20 text-xs font-semibold text-[#0E3B25] hover:bg-[#0E3B25] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C8962E]" aria-hidden="true" />
              <span className="tabular-nums">
                Cart ({itemCount})
                {itemCount > 0 ? ` · ${formatNgn(subtotalNgn)}` : ''}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Division Hero & Overview */}
      <EditableSectionWrapper
        label={division.title}
        target={{ type: 'division', divisionKey }}
      >
        <section className="py-14 lg:py-20 bg-white border-b border-[#0E3B25]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-[#8A6110]">
                    Baffa Njangirde Agro-Allied Farm · Division Overview
                  </p>
                  <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#0E3B25] tracking-tight">
                    {division.title}
                  </h1>
                  <p className="text-lg font-medium text-[#145333]">
                    {division.subtitle}
                  </p>
                  <p className="text-base text-[#354B3E] leading-relaxed">
                    {division.overview}
                  </p>
                  <p className="text-base text-[#354B3E] leading-relaxed">
                    {division.details}
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-[#F4F7F5] border border-[#0E3B25]/12 space-y-3">
                  <h2 className="font-display text-lg font-bold text-[#0E3B25]">
                    Key Farm Practices
                  </h2>
                  <ul className="space-y-2.5">
                    {division.highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-[#2A4135]"
                      >
                        <Check
                          className="w-4 h-4 text-[#0E3B25] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={buildWhatsAppLink(
                      `Hello ${business.name}, I would like to enquire about ${division.title}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0E3B25] text-white text-sm font-semibold hover:bg-[#145333] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#DFB14B]" aria-hidden="true" />
                    <span>Enquire on WhatsApp</span>
                  </a>
                  <a
                    href={business.phoneHref}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#0E3B25]/25 text-[#0E3B25] text-sm font-semibold hover:bg-[#F4F7F5] transition-colors tabular-nums"
                  >
                    <Phone className="w-4 h-4 text-[#8A6110]" aria-hidden="true" />
                    <span>Call {business.phoneDisplay}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="h-full min-h-[320px] lg:min-h-[480px] rounded-xl overflow-hidden border border-[#0E3B25]/15 bg-[#0E3B25]">
                  <ResilientImage
                    src={division.imageUrl}
                    alt={division.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </EditableSectionWrapper>

      {/* Division Products & Paystack Pricing */}
      <section className="py-16 lg:py-20 bg-[#F4F7F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#0E3B25]/12 pb-6">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[#8A6110]">
                {division.title} Offerings · NGN Pricing
              </p>
              <h2 className="font-display text-3xl font-bold text-[#0E3B25]">
                Order & Pay Online with Paystack
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {itemCount > 0 && (
                <PayNowButton
                  label={`Checkout (${itemCount}) · ${formatNgn(subtotalNgn)}`}
                  onClick={() => onNavigate('checkout')}
                />
              )}
              {isEditMode && (
                <button
                  type="button"
                  onClick={() =>
                    openEditor({ type: 'manager', initialTab: 'products' })
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0E3B25] text-white text-xs font-semibold hover:bg-[#145333] cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 text-[#DFB14B]" aria-hidden="true" />
                  <span>Manage Products</span>
                </button>
              )}
            </div>
          </div>

          {displayProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#0E3B25]/12 p-10 text-center space-y-3">
              <p className="text-base font-medium text-[#0E3B25]">
                No products listed under {division.title} yet.
              </p>
              <p className="text-sm text-[#354B3E]">
                Contact us directly via WhatsApp or telephone to discuss current availability.
              </p>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() =>
                    openEditor({ type: 'manager', initialTab: 'products' })
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0E3B25] text-white text-xs font-semibold cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Add Product</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {displayProducts.map((product) => {
                const qty = getQty(product.id);
                const price = product.priceNgn || 0;

                return (
                  <article
                    key={product.id}
                    className="bg-white rounded-xl border border-[#0E3B25]/12 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] w-full overflow-hidden bg-[#0E3B25]">
                        <ResilientImage
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 space-y-3">
                        <p className="text-xs font-semibold text-[#8A6110]">
                          {division.title} · {product.availability}
                        </p>
                        <h3 className="font-display text-xl font-bold text-[#0E3B25]">
                          {product.name}
                        </h3>
                        {price > 0 && (
                          <p className="font-display text-2xl font-bold text-[#0E3B25] tabular-nums">
                            {formatNgn(price)}{' '}
                            <span className="font-sans text-xs font-medium text-[#354B3E]">
                              {product.unitLabel || 'Per Unit'}
                            </span>
                          </p>
                        )}
                        <p className="text-sm text-[#354B3E] leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-4 border-t border-[#0E3B25]/10 space-y-3">
                      {price > 0 && (
                        <>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-[#354B3E]">
                              Quantity
                            </span>
                            <div className="inline-flex items-center border border-[#0E3B25]/20 rounded-lg bg-[#F4F7F5]">
                              <button
                                type="button"
                                aria-label={`Decrease quantity of ${product.name}`}
                                onClick={() => setQty(product.id, qty - 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#0E3B25] hover:bg-white rounded-l-lg cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                min={1}
                                max={500}
                                aria-label={`Quantity for ${product.name}`}
                                value={qty}
                                onChange={(e) =>
                                  setQty(product.id, parseInt(e.target.value || '1', 10))
                                }
                                className="w-12 text-center text-xs font-semibold text-[#0E3B25] bg-transparent tabular-nums focus:outline-none"
                              />
                              <button
                                type="button"
                                aria-label={`Increase quantity of ${product.name}`}
                                onClick={() => setQty(product.id, qty + 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#0E3B25] hover:bg-white rounded-r-lg cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                addToCart(product.id, qty);
                                openCart();
                              }}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-[#0E3B25]/25 text-xs font-semibold text-[#0E3B25] hover:bg-[#F4F7F5] transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Add to Cart</span>
                            </button>
                            <PayNowButton
                              size="sm"
                              label="Pay Now"
                              onClick={() => handlePayNowProduct(product.id)}
                              className="flex-1"
                            />
                          </div>
                        </>
                      )}

                      <a
                        href={buildWhatsAppLink(
                          `Hello ${business.name}, I would like to enquire about ${product.name} (${division.title}).`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A6110] hover:text-[#0E3B25] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Enquire via WhatsApp</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
