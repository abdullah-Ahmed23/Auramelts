import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import ProductCard from '../products/ProductCard';
import QuickAddModal from '../products/QuickAddModal';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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
        <div className="mb-16 text-center">
          <div
            data-aos="fade-up"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-semibold tracking-[0.2em] uppercase text-[#7B4B94] bg-[#7B4B94]/10 rounded-full border border-[#7B4B94]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E84A8A]" />
              Handpicked
            </span>
          </div>
          <h2
            data-aos="fade-up"
            data-aos-delay="100"
            className="mb-4 text-4xl font-bold text-[#7B4B94] md:text-5xl"
          >
            Featured <span className="italic text-[#E84A8A]">Collection</span>
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-[#7B4B94]/70 max-w-lg mx-auto text-lg"
          >
            Our most loved scents, hand-poured with intention to transform your daily rituals.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#7B4B94]" />
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((product, index) => (
              <div key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
                <ProductCard
                  product={product}
                  index={index}
                  onQuickAdd={handleQuickAdd}
                />
              </div>
            ))}
          </div>
        )}

        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="mt-16 text-center"
        >
          <Button asChild size="lg" className="h-14 rounded-full px-10 bg-[#7B4B94] hover:bg-[#6A3F82] text-white font-semibold shadow-lg shadow-[#7B4B94]/20 transition-all hover:scale-105 hover:-translate-y-0.5">
            <Link to="/products" className="inline-flex items-center gap-2">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
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
