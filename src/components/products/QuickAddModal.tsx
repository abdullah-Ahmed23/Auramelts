import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickAddModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

const QuickAddModal = ({ product, isOpen, onClose }: QuickAddModalProps) => {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | undefined>();

    useEffect(() => {
        if (product) {
            setQuantity(1);
            setSelectedSize(product.sizes?.[0]);
        }
    }, [product, isOpen]);

    if (!product) return null;

    const handleAddToCart = () => {
        addItem(product, quantity, selectedSize);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-[#FFF9F0] border-[#E6C9C9]/50 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Product Image */}
                    <div className="relative h-64 md:h-full bg-white">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                        {product.bestSeller && (
                            <span className="absolute left-4 top-4 rounded-full bg-[#FF85A1] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                                Best Seller
                            </span>
                        )}
                        {product.newArrival && (
                            <span className="absolute left-4 top-4 rounded-full bg-[#72C7B3] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                                New Arrival
                            </span>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="p-8 flex flex-col h-full">
                        <DialogHeader className="p-0 mb-4 text-left">
                            <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-[#FFD700] text-[#FFD700]" />)}
                            </div>
                            <DialogTitle className="font-heading text-2xl font-bold text-[#4A3B4E]">
                                {product.name}
                            </DialogTitle>
                            {product.scent && (
                                <p className="text-sm font-medium uppercase tracking-widest text-[#8E5B6F]/60 mt-1">
                                    {product.scent}
                                </p>
                            )}
                        </DialogHeader>

                        <div className="mb-6">
                            <p className="text-2xl font-bold text-[#FF85A1] mb-4">
                                {product.price.toLocaleString()} EGP
                            </p>
                            <p className="text-sm text-[#8E5B6F]/80 leading-relaxed line-clamp-3">
                                {product.description}
                            </p>
                        </div>

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-6">
                                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#4A3B4E]">
                                    Select Size
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 ${selectedSize === size
                                                ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                                                : 'border-[#E6C9C9] bg-white text-[#8E5B6F] hover:border-primary'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-8 mt-auto">
                            <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#4A3B4E]">
                                Quantity
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-white rounded-full border border-[#E6C9C9] p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#8E5B6F] transition-colors hover:bg-[#FFF9F0]"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-6 text-center font-bold text-[#4A3B4E]">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#8E5B6F] transition-colors hover:bg-[#FFF9F0]"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="text-sm font-medium text-[#8E5B6F]/60">
                                    Total: <span className="text-[#FF85A1] font-bold">{(product.price * quantity).toLocaleString()} EGP</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 rounded-full text-base font-bold bg-[#FF85A1] hover:bg-[#FF85A1]/90 shadow-lg shadow-[#FF85A1]/20 group transition-all"
                            onClick={handleAddToCart}
                        >
                            <ShoppingBag className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                            Add to Ritual
                        </Button>

                        <button
                            onClick={onClose}
                            className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E5B6F]/50 hover:text-primary transition-colors block text-center"
                        >
                            View Full Details
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QuickAddModal;
