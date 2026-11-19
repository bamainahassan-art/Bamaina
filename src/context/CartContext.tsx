import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CartItem, ServerProductDTO } from '../types/site';

const CART_STORAGE_KEY = 'baffa_njangirde_cart_v1';

export function formatNgn(amountNgn: number): string {
  return `₦${new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountNgn)}`;
}

interface CartContextValue {
  serverProducts: ServerProductDTO[];
  loadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalNgn: number;
  getProductInfo: (productId: string) => ServerProductDTO | undefined;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        typeof item?.productId === 'string' &&
        typeof item?.quantity === 'number' &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [serverProducts, setServerProducts] = useState<ServerProductDTO[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>(loadStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) return;
      const data = (await res.json()) as { products?: ServerProductDTO[] };
      if (Array.isArray(data.products)) {
        setServerProducts(data.products);
      }
    } catch {
      // Keep existing catalog if offline
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage error
    }
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (productId: string, quantity = 1) => {
    const cleanQty = Math.max(1, Math.min(500, Math.floor(quantity)));
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.min(500, i.quantity + cleanQty) }
            : i
        );
      }
      return [...prev, { productId, quantity: cleanQty }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    const cleanQty = Math.min(500, Math.floor(quantity));
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: cleanQty } : i
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => setCartItems([]);

  const getProductInfo = (productId: string) =>
    serverProducts.find((p) => p.id === productId);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalNgn = cartItems.reduce((sum, item) => {
    const product = serverProducts.find((p) => p.id === item.productId);
    if (!product) return sum;
    return sum + product.price_ngn * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        serverProducts,
        loadingProducts,
        refreshProducts,
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotalNgn,
        getProductInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
