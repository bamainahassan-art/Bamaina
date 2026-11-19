import React, { useEffect } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatNgn, useCart } from '../context/CartContext';
import { PageRoute } from '../types/site';
import { PayNowButton } from './PayNowButton';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  onNavigate: (route: PageRoute) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    getProductInfo,
    subtotalNgn,
    itemCount,
  } = useCart();

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    onNavigate('checkout');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
    >
      <div
        className="fixed inset-0"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside className="relative z-10 w-full max-w-md bg-white h-full flex flex-col border-l border-[#0E3B25]/15 shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0E3B25] text-white flex items-center justify-between border-b border-[#DFB14B]/30">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#DFB14B]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold">
              Order Cart ({itemCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close shopping cart"
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#F4F7F5] border border-[#0E3B25]/15 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[#0E3B25]" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="font-display text-lg font-bold text-[#0E3B25]">
                  Your order cart is empty
                </p>
                <p className="text-sm text-[#354B3E]">
                  Select livestock, poultry, or fish farming produce to begin checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="px-5 py-2.5 rounded-lg bg-[#0E3B25] text-white text-sm font-semibold hover:bg-[#145333] cursor-pointer"
              >
                Browse Products & Checkout
              </button>
            </div>
          ) : (
            cartItems.map((line) => {
              const product = getProductInfo(line.productId);
              if (!product) return null;
              const lineTotal = product.price_ngn * line.quantity;

              return (
                <div
                  key={line.productId}
                  className="p-4 rounded-xl border border-[#0E3B25]/12 bg-[#F4F7F5]/60 flex gap-3.5"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#0E3B25]/10 bg-[#0E3B25] shrink-0">
                    <ResilientImage
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-sm font-bold text-[#0E3B25] leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#8A6110] font-medium tabular-nums">
                          {formatNgn(product.price_ngn)} · {product.unit_label}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(line.productId)}
                        aria-label={`Remove ${product.name}`}
                        className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="inline-flex items-center border border-[#0E3B25]/20 rounded-md bg-white">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${product.name}`}
                          onClick={() =>
                            updateQuantity(line.productId, line.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#0E3B25] hover:bg-[#F4F7F5] cursor-pointer"
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
                              Math.max(1, parseInt(e.target.value || '1', 10))
                            )
                          }
                          className="w-12 text-center text-xs font-semibold text-[#0E3B25] tabular-nums focus:outline-none"
                        />
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${product.name}`}
                          onClick={() =>
                            updateQuantity(line.productId, line.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#0E3B25] hover:bg-[#F4F7F5] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#0E3B25] tabular-nums">
                        {formatNgn(lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Totals */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-[#F4F7F5] border-t border-[#0E3B25]/15 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#354B3E]">
                <span>Subtotal (NGN)</span>
                <span className="font-semibold tabular-nums">
                  {formatNgn(subtotalNgn)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#0E3B25] pt-2 border-t border-[#0E3B25]/10">
                <span>Order Total</span>
                <span className="tabular-nums">{formatNgn(subtotalNgn)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <PayNowButton
                size="lg"
                label="Pay Now via Paystack"
                onClick={handleCheckout}
                className="w-full"
              />
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
