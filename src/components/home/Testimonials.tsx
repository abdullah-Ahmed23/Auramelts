import { motion, useMotionValue } from 'framer-motion';
import { Star, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

const TestimonialCard = ({ review }: { review: any }) => {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group h-full"
    >
      <div className="h-full p-8 bg-white/90 rounded-3xl border border-[#E84A8A]/10 shadow-lg hover:shadow-2xl hover:shadow-[#E84A8A]/15 hover:border-[#E84A8A]/30 transition-all duration-500 relative overflow-hidden">
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E84A8A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

        <div className="relative z-10">
          {/* Stars */}
          <div className="flex gap-1 mb-6">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-[#F5A623] fill-[#F5A623]" />
            ))}
          </div>

          {/* Quote Icon */}
          <div className="absolute top-4 right-4 text-6xl text-[#E84A8A]/10 font-serif leading-none select-none">
            "
          </div>

          {/* Feedback */}
          <p className="text-[#7B4B94]/80 text-base leading-relaxed mb-8 italic">
            "{review.feedback}"
          </p>

          {/* Author Info */}
          <div className="border-t border-[#E84A8A]/10 pt-4">
            <p className="font-bold text-[#7B4B94] text-lg">{review.name}</p>
            {review.location && (
              <p className="text-sm text-[#E84A8A]/70 mt-1">{review.location}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const x = useMotionValue(0);
  const [activeDot, setActiveDot] = useState(0);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching testimonials:', error);
      return data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  // Track scroll position and update active dot
  useEffect(() => {
    const unsubscribe = x.on('change', (latest) => {
      if (testimonials.length === 0) return;
      const cardWidth = 400; // Approximate card width
      const index = Math.abs(Math.round(latest / cardWidth)) % testimonials.length;
      setActiveDot(index);
    });

    return () => unsubscribe();
  }, [x, testimonials.length]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E84A8A]" />
      </div>
    )
  }

  if (testimonials.length === 0) return null;

  // Triple the testimonials for seamless infinite loop
  const loopedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="relative py-32 md:py-40 overflow-hidden bg-gradient-to-b from-[#FDF8F4] to-[#F5F0E6]">
      {/* Enhanced Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5CC5B5]/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#E84A8A]/15 rounded-full blur-[70px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7B4B94]/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="container relative mx-auto px-4 max-w-7xl z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center gap-1.5 mb-8"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Star className="w-6 h-6 text-[#F5A623] fill-[#F5A623]" />
              </motion.div>
            ))}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-[#7B4B94] mb-6 leading-tight"
          >
            What People Are <span className="italic text-[#E84A8A] font-serif">Saying</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-[#7B4B94]/70 text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of happy customers who transformed their spaces with our handcrafted candles
          </motion.p>
        </div>

        {/* Infinite Loop Carousel */}
        <div className="relative overflow-hidden mb-12 py-8">
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: -2000, right: 0 }}
            dragElastic={0.2}
            style={{ x }}
            animate={{
              x: [0, -400 * testimonials.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {loopedTestimonials.map((review: any, index: number) => (
              <div key={`${review.id}-${index}`} className="flex-shrink-0 w-[85vw] md:w-[400px] px-4">
                <TestimonialCard review={review} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mb-12">
          {testimonials.slice(0, Math.min(5, testimonials.length)).map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: activeDot === index ? 1.5 : 1,
                backgroundColor: activeDot === index ? 'rgba(232, 74, 138, 0.8)' : 'rgba(232, 74, 138, 0.3)',
              }}
              transition={{ duration: 0.3 }}
              className="w-2 h-2 rounded-full cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
