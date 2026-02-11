import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, Variants } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ImageOptimizer } from '@/components/ImageOptimizer';

import { Skeleton } from '@/components/ui/skeleton';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const CategoryCards = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name').limit(6);
      if (error) console.error('Error fetching categories:', error);
      return data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const scrollPosition = scrollContainerRef.current.scrollLeft;
    // Card width is 90vw + 16px gap (approx)
    const cardWidth = scrollContainerRef.current.offsetWidth * 0.9 + 16;
    const index = Math.round(scrollPosition / cardWidth);
    // Clamp index to valid range
    setActiveDot(Math.min(index, categories.length - 1));
  };

  const scrollToCategory = (index: number) => {
    if (!scrollContainerRef.current) return;
    const cardWidth = scrollContainerRef.current.offsetWidth * 0.8; // Approx 80vw + gap
    // Use card width + gap (16px/1rem) for more precise scrolling
    const gap = 16;
    const targetScroll = index * (scrollContainerRef.current.offsetWidth < 768 ? (window.innerWidth * 0.8 + gap) : 300); // Rough estimation

    // Better simple approach for now: scroll to the Nth child
    const child = scrollContainerRef.current.children[index] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    setActiveDot(index);
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#FDF8F4]">
      {/* Ambient Glow from Logo Colors */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5CC5B5]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#E84A8A]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative mx-auto px-4 md:px-8 max-w-7xl z-10">
        {/* Header */}
        <div className="mb-16 md:mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
          </motion.div>
        </div>

        {/* Grid / Carousel */}
        <motion.div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
          className={`flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-4 px-[5%] md:grid md:grid-cols-3 md:gap-6 md:pb-0 md:mx-0 md:px-0 no-scrollbar cursor-grab ${isDragging ? 'cursor-grabbing snap-none' : ''}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {isLoading ? (
            // Skeleton Loading State
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-[400px] min-w-[280px] w-[90vw] md:w-auto md:h-full snap-center flex-shrink-0"
              >
                <div className="h-full p-6 md:p-8 rounded-3xl bg-white border border-[#E84A8A]/10 shadow-sm overflow-hidden flex flex-col justify-between">
                  {/* Fake Image Area */}
                  <Skeleton className="w-full h-1/2 rounded-2xl bg-[#7B4B94]/5" />

                  {/* Fake Content Area */}
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-16 rounded-full bg-[#E84A8A]/10" />
                    <Skeleton className="h-8 w-3/4 rounded-lg bg-[#7B4B94]/10" />
                    <div className="flex justify-between items-center mt-4">
                      <Skeleton className="h-4 w-24 rounded bg-[#7B4B94]/5" />
                      <Skeleton className="h-10 w-10 rounded-full bg-[#E84A8A]/10" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            categories.map((cat: any, i: number) => {
              const isHovered = hoveredIndex === i;

              return (
                <motion.div
                  key={cat.id}
                  variants={cardVariants}
                  className="h-[400px] min-w-[280px] w-[90vw] md:w-auto md:h-full snap-center flex-shrink-0"
                >
                  <Link
                    to={`/products?category=${cat.slug}`}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="group relative block h-full select-none"
                    draggable="false"
                  >
                    <motion.div
                      className="relative h-full min-h-[260px] p-6 md:p-8 rounded-3xl bg-white overflow-hidden border border-[#E84A8A]/20 shadow-lg shadow-[#E84A8A]/5"
                      whileHover={{
                        y: -10,
                        boxShadow: "0 20px 40px -10px rgba(232, 74, 138, 0.15)",
                        transition: { duration: 0.3 }
                      }}
                    >
                      {/* Image Background */}
                      {cat.image ? (
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
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        </div>
                      ) : (
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
                        <div className={`backdrop-blur-md border p-4 rounded-2xl shadow-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ${cat.image ? 'bg-white/90 border-white/50' : 'bg-white/80 border-[#E84A8A]/10'}`}>
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
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Navigation Dots (Mobile Only) */}
        <div className="flex md:hidden justify-center gap-2 mt-4 mb-2">
          {categories.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => scrollToCategory(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${activeDot === index ? 'w-6 bg-[#E84A8A]' : 'bg-[#E84A8A]/30'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div
          className="mt-12 md:mt-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#7B4B94] text-white rounded-full font-semibold text-sm tracking-wide hover:bg-[#6A3F82] transition-colors hover:shadow-xl hover:shadow-[#7B4B94]/30"
            >
              View All Products
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div >
    </section >
  );
};

export default CategoryCards;
