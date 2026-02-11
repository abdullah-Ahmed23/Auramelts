import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import CheckoutModal from '@/components/cart/CheckoutModal';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-[#FDF8F4] border-l border-[#E84A8A]/10 p-0">

        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-[#E84A8A]/10 bg-white/50 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-heading text-2xl font-bold text-[#7B4B94] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E84A8A]" />
              Your Ritual <span className="text-[#E84A8A] text-lg font-medium">({totalItems})</span>
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-6 px-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-[#E84A8A]/5 rounded-full flex items-center justify-center mb-2"
              >
                <ShoppingBag className="w-10 h-10 text-[#E84A8A]/40" />
              </motion.div>
              <h3 className="text-xl font-bold text-[#7B4B94]">Your cart is empty</h3>
              <p className="text-[#7B4B94]/60 max-w-[200px]">Looks like you haven't added any magical senses yet.</p>
              <Button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 h-12 rounded-xl bg-[#7B4B94] text-white hover:bg-[#6A3F82] px-8 shadow-lg shadow-[#7B4B94]/20"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence mode='popLayout'>
                {items.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    key={`${item.product.id}-${item.variant?.name || 'default'}`}
                    className="flex gap-5 group bg-white p-3 rounded-2xl shadow-sm border border-[#E84A8A]/5"
                  >
                    {/* Image */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-[#E84A8A]/10 bg-[#FDF8F4]">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-heading font-bold text-[#7B4B94] text-base leading-tight pr-2 line-clamp-1">
                            {item.product.name}
                          </h3>
                          <p className="font-bold text-[#E84A8A] text-sm whitespace-nowrap">
                            {(item.product.price * item.quantity).toLocaleString()} EGP
                          </p>
                        </div>

                        {item.variant && (
                          <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-md bg-[#E84A8A]/5 border border-[#E84A8A]/10">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-[#E84A8A]">{item.variant.name}</span>
                          </div>
                        )}
                        {item.product.scent && !item.variant && (
                          <p className="text-xs text-[#7B4B94]/50 mt-1 truncate">{item.product.scent}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center gap-2 bg-[#FDF8F4] rounded-lg border border-[#E84A8A]/10 px-1 py-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.name)}
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 flex items-center justify-center text-[#7B4B94] hover:bg-white rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-[#7B4B94]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.name)}
                            className="w-6 h-6 flex items-center justify-center text-[#7B4B94] hover:bg-white rounded-md transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.product.id, item.variant?.name)}
                          className="text-[#7B4B94]/40 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E84A8A]/10 bg-white/80 p-6 space-y-4 backdrop-blur-md z-10">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[#7B4B94]/60 text-sm font-medium">
                <span>Subtotal ({totalItems} items)</span>
                <span>{totalPrice.toLocaleString()} EGP</span>
              </div>
              <div className="flex items-center justify-between text-[#7B4B94] text-lg font-bold pt-2 border-t border-dashed border-[#E84A8A]/20">
                <span>Total</span>
                <span className="text-2xl text-[#E84A8A]">{totalPrice.toLocaleString()} EGP</span>
              </div>
              <p className="text-[10px] text-[#7B4B94]/40 text-center uppercase tracking-wider font-semibold">Shipping & taxes calculated at checkout</p>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#E84A8A] to-[#7B4B94] text-white font-bold text-lg shadow-xl shadow-[#E84A8A]/20 hover:shadow-[#E84A8A]/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
              >
                Checkout <ArrowRight className="w-5 h-5 opacity-80" />
              </Button>
              <Button
                variant="ghost"
                className="w-full h-12 rounded-2xl text-[#7B4B94]/70 hover:bg-[#E84A8A]/5 hover:text-[#7B4B94] font-semibold"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </Sheet>
  );
};

export default CartDrawer;
