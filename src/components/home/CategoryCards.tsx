import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ImageOptimizer } from '@/components/ImageOptimizer';

const CategoryCards = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name').limit(6);
      if (error) console.error('Error fetching categories:', error);
      return data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#FDF8F4]">
      {/* Ambient Glow from Logo Colors */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5CC5B5]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#E84A8A]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative mx-auto px-4 md:px-8 max-w-7xl z-10">
        {/* Header */}
        <div className="mb-16 md:mb-20 text-center">
          <div
            data-aos="fade-up"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-semibold tracking-[0.2em] uppercase text-[#7B4B94] bg-[#7B4B94]/10 rounded-full border border-[#7B4B94]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E84A8A]" />
              Scent Collections
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7B4B94] mb-6 tracking-tight">
              Find Your <span className="italic text-[#E84A8A]">Perfect</span> Mood
            </h2>
            <p className="text-lg text-[#7B4B94]/70 max-w-xl mx-auto leading-relaxed">
              Each collection is thoughtfully curated to match every moment of your day.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat: any, i: number) => {
            const isHovered = hoveredIndex === i;

            return (
              <div
                key={cat.id}
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative block h-full"
                >
                  <div
                    className="relative h-full min-h-[200px] md:min-h-[260px] p-6 md:p-8 rounded-3xl bg-white overflow-hidden border border-[#E84A8A]/20 shadow-lg shadow-[#E84A8A]/10 hover:shadow-xl hover:shadow-[#E84A8A]/15 transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Image Background */}
                    {cat.image && (
                      <div className="absolute inset-0 z-0">
                        <ImageOptimizer
                          src={cat.image}
                          alt={cat.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          priority={i < 3}
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    )}

                    {!cat.image && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#5CC5B5]/5 to-[#E84A8A]/5 opacity-60" />
                    )}

                    {/* Accent Circle - Only if no image */}
                    {!cat.image && (
                      <div
                        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#5CC5B5] transition-all duration-400 ${isHovered ? 'scale-125 opacity-25' : 'scale-100 opacity-10'}`}
                      />
                    )}

                    {/* Content - Floating Glass Island */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-4">
                      {/* Icon Fallback - Only show if NO image */}
                      {!cat.image && (
                        <div className="mb-auto pt-6 flex justify-center">
                          <div
                            className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm border border-[#E84A8A]/10 text-4xl transition-transform duration-300 ${isHovered ? 'scale-110 rotate-3' : ''}`}
                          >
                            {cat.icon || '✨'}
                          </div>
                        </div>
                      )}

                      {/* Glass Info Box */}
                      <div className="bg-white/90 backdrop-blur-md border border-white/50 p-4 rounded-2xl shadow-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-[#2A2A2A] leading-tight">
                              {cat.name}
                            </h3>
                            <p className="text-xs font-semibold text-[#E84A8A] mt-1 tracking-wide uppercase">
                              Shop Collection
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-[#E84A8A] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-md shadow-[#E84A8A]/20">
                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="mt-12 md:mt-16 text-center"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#7B4B94] text-white rounded-full font-semibold text-sm tracking-wide hover:bg-[#6A3F82] transition-all hover:shadow-xl hover:shadow-[#7B4B94]/30 hover:-translate-y-1"
          >
            View All Products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
