import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sophie M.',
    text: 'The Vanilla Dream candle is absolutely divine! The scent fills my entire living room and lasts forever.',
    rating: 5,
    location: 'Cairo, Egypt',
    badge: 'Verified Buyer'
  },
  {
    name: 'James L.',
    text: 'Bought the candle care kit as a gift and it was beautifully packaged. My partner loved it!',
    rating: 5,
    location: 'Alexandria, Egypt',
    badge: 'Verified Buyer'
  },
  {
    name: 'Emily R.',
    text: 'I\'ve tried many wax melts but these are by far the best. The scents are so natural and not overpowering.',
    rating: 5,
    location: 'Giza, Egypt',
    badge: 'Verified Buyer'
  },
  {
    name: 'Ahmed K.',
    text: 'Perfect ambiance for my home office. These wax melts help me focus and feel relaxed at the same time.',
    rating: 4,
    location: 'Luxor, Egypt',
    badge: 'Verified Buyer'
  },
  {
    name: 'Sarah T.',
    text: 'My new favorite brand! The quality is unmatched and the scents last incredibly long.',
    rating: 5,
    location: 'Hurghada, Egypt',
    badge: 'Verified Buyer'
  },
  {
    name: 'Omar H.',
    text: 'Gifted these to my mom and she absolutely loves them. Will be ordering more for the whole family!',
    rating: 5,
    location: 'Aswan, Egypt',
    badge: 'Verified Buyer'
  },
  {
    name: 'Layla E.',
    text: 'Best custom scent experience in Egypt. The quality exceeded my expectations!',
    rating: 5,
    location: 'Sharm El Sheikh, Egypt',
    badge: 'Verified Buyer'
  },
  {
    name: 'Mostafa M.',
    text: 'Fits perfectly in my space, and they genuinely look very good. Aura Melts delivered exactly what was promised!',
    rating: 5,
    location: 'Port Said, Egypt',
    badge: 'Verified Buyer'
  },
];

const TestimonialCard = ({ review }: { review: typeof testimonials[0] }) => (
  <div className="flex-shrink-0 w-[300px] md:w-[340px] mx-2">
    <div className="h-full p-6 bg-white rounded-2xl border border-[#E84A8A]/10 shadow-md hover:shadow-xl hover:shadow-[#E84A8A]/10 transition-all duration-300 group">
      {/* Stars & Quote Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" />
          ))}
        </div>
        <Quote className="w-8 h-8 text-[#E84A8A]/20 group-hover:text-[#E84A8A]/40 transition-colors" />
      </div>

      {/* Quote Text */}
      <p className="text-[#7B4B94]/80 text-sm leading-relaxed mb-6 min-h-[80px]">
        "{review.text}"
      </p>

      {/* Author Info */}
      <div className="border-t border-[#E84A8A]/10 pt-4">
        <p className="font-bold text-[#7B4B94] text-sm uppercase tracking-wide">{review.name}</p>
        <p className="text-xs text-[#E84A8A]/60 mt-0.5">{review.badge}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  // Duplicate testimonials for seamless loop
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#FDF8F4]">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#5CC5B5]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#E84A8A]/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="container relative mx-auto px-4 max-w-7xl z-10">
        {/* Header - Aura Melts Style */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1 mb-6"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-[#F5A623] fill-[#F5A623]" />
            ))}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[#7B4B94] mb-4"
          >
            What People Are <span className="italic text-[#E84A8A]">Saying</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#7B4B94]/70 text-lg max-w-md mx-auto"
          >
            Join thousands of happy customers who transformed their spaces
          </motion.p>
        </div>

        {/* Animated Row 1 - Moving Right */}
        <div className="relative mb-6 overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: [0, -1400] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate for seamless loop */}
            {[...row1, ...row1, ...row1].map((review, index) => (
              <TestimonialCard key={index} review={review} />
            ))}
          </motion.div>
        </div>

        {/* Animated Row 2 - Moving Left */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: [-1400, 0] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate for seamless loop */}
            {[...row2, ...row2, ...row2].map((review, index) => (
              <TestimonialCard key={index} review={review} />
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-[#E84A8A]/15 shadow-md">
            <div className="flex -space-x-2">
              {['👩🏻', '👨🏽', '👩🏼', '👨🏻'].map((emoji, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-[#5CC5B5]/10 flex items-center justify-center border-2 border-white text-sm">
                  {emoji}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#7B4B94]">Rated 4.9/5</p>
              <p className="text-xs text-[#E84A8A]/70">from 2,500+ reviews</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
