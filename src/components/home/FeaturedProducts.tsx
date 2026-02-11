import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import ProductCard from '../products/ProductCard';
import QuickAddModal from '../products/QuickAddModal';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: featured = [], isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4);

      if (error) throw error;

      // Map Supabase data to Product interface
      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        category: 'candles', // Default fallback
        scent: p.scent,
        featured: p.featured,
        bestSeller: p.is_best_seller,
        // Simple logic for new arrival: created in last 30 days
        newArrival: new Date(p.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        variants: p.variants || [],
        stock: p.stock || 0
      })) as Product[];
    }
  });

  const handleQuickAdd = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section className="py-24 md:py-32 bg-[#F5F0E6] relative overflow-hidden">
      {/* Ambient Glow - Reduced blur for mobile */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5CC5B5]/10 rounded-full blur-[60px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#E84A8A]/10 rounded-full blur-[50px] md:blur-[100px] pointer-events-none" />

      <div className="container relative mx-auto px-4 max-w-7xl z-10">
        <div className="mb-12 md:mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-semibold tracking-[0.2em] uppercase text-[#7B4B94] bg-[#7B4B94]/10 rounded-full border border-[#7B4B94]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E84A8A]" />
              Handpicked
            </span>
            <h2 className="mb-4 text-4xl font-bold text-[#7B4B94] md:text-5xl">
              Featured <span className="italic text-[#E84A8A]">Collection</span>
            </h2>
            <p className="text-[#7B4B94]/70 max-w-lg mx-auto text-lg">
              Our most loved senses, hand-poured with intention to transform your daily rituals.
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="group">
                {/* Fake Image Area */}
                <div className="relative overflow-hidden rounded-2xl border border-[#E6C9C9]/30 bg-white aspect-[4/5] mb-4">
                  <Skeleton className="h-full w-full bg-[#E84A8A]/5" />
                </div>
                {/* Fake Content Area */}
                <div className="space-y-3 px-2">
                  <div className="flex justify-center gap-1">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mx-auto rounded-lg bg-[#7B4B94]/10" />
                  <Skeleton className="h-4 w-1/2 mx-auto rounded bg-[#E84A8A]/10" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
            {featured.slice(0, 4).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}

        <div className="mt-12 md:mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg" className="h-14 rounded-full px-10 bg-[#7B4B94] hover:bg-[#6A3F82] text-white font-semibold shadow-lg shadow-[#7B4B94]/20 transition-colors">
              <Link to="/products" className="inline-flex items-center gap-2">
                View All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      <QuickAddModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default FeaturedProducts;
