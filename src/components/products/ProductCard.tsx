import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { ImageOptimizer } from '@/components/ImageOptimizer';

interface ProductCardProps {
    product: Product;
    index?: number;
    onQuickAdd: (product: Product) => void;
}

const ProductCard = React.memo(({ product, index = 0, onQuickAdd }: ProductCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group"
        >
            <div className="relative overflow-hidden rounded-2xl border border-[#E6C9C9]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF85A1]/10 hover:-translate-y-2">
                <Link to={`/products/${product.id}`} className="block">
                    <div className="relative overflow-hidden aspect-[4/5]">
                        <ImageOptimizer
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={500}
                            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock === 0 ? 'grayscale opacity-60' : ''}`}
                            priority={index < 4} // Prioritize first 4 images
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />

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
                        {product.stock === 0 && (
                            <span className="absolute right-4 top-4 rounded-full bg-black/60 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg border border-white/10">
                                Out of Stock
                            </span>
                        )}

                        {/* Hover Quick Add Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                            <Button
                                className="w-full rounded-full bg-white/90 backdrop-blur-md text-[#4A3B4E] hover:bg-white hover:text-primary border-none shadow-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={product.stock === 0}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onQuickAdd(product);
                                }}
                            >
                                Quick Add
                            </Button>
                        </div>
                    </div>
                </Link>

                <div className="p-6 text-center">
                    <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-[#FFD700] text-[#FFD700]" />)}
                    </div>
                    <Link to={`/products/${product.id}`}>
                        <h3 className="mb-2 font-heading text-xl font-bold text-[#4A3B4E] transition-colors hover:text-primary">
                            {product.name}
                        </h3>
                    </Link>
                    {product.scent && (
                        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#8E5B6F]/50">{product.scent}</p>
                    )}
                    <div className="pt-4 border-t border-[#E6C9C9]/20 flex items-center justify-center">
                        <span className="font-heading text-xl font-bold text-[#FF85A1]">
                            {product.price.toLocaleString()} EGP
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

export default ProductCard;
