import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '@/data/products';
import { toast } from 'sonner';

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: { name: string, price: number };
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: { name: string, price: number }) => void;
  removeItem: (productId: string, variantName?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantName?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = useCallback((product: Product, quantity = 1, variant?: { name: string, price: number }) => {
    setItems((prev) => {
      // Find existing item
      const existing = prev.find((item) =>
        item.product.id === product.id &&
        item.variant?.name === variant?.name
      );

      const currentQty = existing ? existing.quantity : 0;
      const maxStock = product.stock || 0;

      // Check stock limit (if stock management is enabled/tracked)
      if (maxStock > 0 && (currentQty + quantity) > maxStock) {
        toast.error(`Sorry, only ${maxStock} available in stock.`);
        return prev;
      }

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.variant?.name === variant?.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, variant }];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, variantName?: string) => {
    setItems((prev) => prev.filter((item) =>
      !(item.product.id === productId && item.variant?.name === variantName)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantName?: string) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) =>
        !(item.product.id === productId && item.variant?.name === variantName)
      ));
      return;
    }

    setItems((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId && item.variant?.name === variantName) {
          const maxStock = item.product.stock || 0;
          if (maxStock > 0 && quantity > maxStock) {
            toast.error(`Sorry, only ${maxStock} available in stock.`);
            return { ...item, quantity: maxStock };
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.variant ? item.variant.price : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
