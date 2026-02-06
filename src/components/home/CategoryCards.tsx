import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '@/data/products';
import { ArrowRight } from 'lucide-react';

const CategoryCards = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, i) => {
            const isHovered = hoveredIndex === i;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={`/products?category=${cat.id}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative block h-full"
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative h-full min-h-[200px] md:min-h-[260px] p-6 md:p-8 rounded-3xl bg-white overflow-hidden border border-[#E84A8A]/20 shadow-lg shadow-[#E84A8A]/10 hover:shadow-xl hover:shadow-[#E84A8A]/15 transition-all duration-300"
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#5CC5B5]/5 to-[#E84A8A]/5 opacity-60" />

                    {/* Accent Circle */}
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.2 : 1,
                        opacity: isHovered ? 0.25 : 0.1,
                      }}
                      transition={{ duration: 0.4 }}
                      className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#5CC5B5]"
                    />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      {/* Icon */}
                      <div className="mb-4">
                        <motion.div
                          whileHover={{ scale: 1.05, rotate: 3 }}
                          className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#5CC5B5]/10 shadow-md border border-[#5CC5B5]/20"
                        >
                          <span className="text-4xl md:text-5xl">{cat.icon}</span>
                        </motion.div>
                      </div>

                      {/* Text */}
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-[#7B4B94] mb-3">
                          {cat.name}
                        </h3>

                        {/* Explore Link */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#E84A8A]">
                            Explore
                          </span>
                          <motion.div
                            animate={{ x: isHovered ? 4 : 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            <ArrowRight className="w-4 h-4 text-[#E84A8A]" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 md:mt-16 text-center"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#7B4B94] text-white rounded-full font-semibold text-sm tracking-wide hover:bg-[#6A3F82] transition-all hover:shadow-xl hover:shadow-[#7B4B94]/30 hover:-translate-y-1"
          >
            View All Products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryCards;
