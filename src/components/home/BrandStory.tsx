import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Leaf, Clock, Heart } from 'lucide-react';

const BrandStory = () => {
  const features = [
    {
      icon: Flame,
      title: 'Hand-Poured',
      desc: 'Crafted with love in small batches',
      color: '#F5A623'
    },
    {
      icon: Leaf,
      title: '100% Soy Wax',
      desc: 'Clean-burning & eco-friendly',
      color: '#5CC5B5'
    },
    {
      icon: Clock,
      title: 'Long-Lasting',
      desc: 'Up to 80+ hours of fragrance',
      color: '#7B4B94'
    },
    {
      icon: Heart,
      title: 'Unique Blends',
      desc: 'Exclusive scent combinations',
      color: '#E84A8A'
    },
  ];

  return (
    <section className="relative py-28 md:py-36 overflow-hidden bg-[#F5F0E6]">
      {/* Soft Glow from Logo Colors */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#5CC5B5]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#E84A8A]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 right-[15%] w-16 h-16 border-2 border-[#E84A8A]/30 rounded-full hidden md:block"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-32 left-[10%] w-3 h-3 bg-[#5CC5B5]/50 rounded-full hidden md:block"
      />

      <div className="container relative mx-auto px-4 md:px-8 max-w-7xl z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-[#E84A8A]/10 border border-[#E84A8A]/20"
            >
              <span className="w-2 h-2 rounded-full bg-[#E84A8A] animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#E84A8A]">Our Story</span>
            </motion.span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7B4B94] mb-8 leading-[1.1]">
              Where{' '}
              <span className="italic text-[#E84A8A]">Warmth</span>{' '}
              Meets{' '}
              <span className="italic text-[#5CC5B5]">Wonder</span>
            </h2>

            <p className="text-lg text-[#7B4B94]/70 leading-relaxed mb-10 max-w-lg">
              Born from a passion for creating the perfect home ambiance, Aura Melts brings you
              handcrafted wax melts that transform any space into a sanctuary of calm and comfort.
            </p>

            <Link
              to="/about"
              className="group inline-flex items-center gap-4"
            >
              <span className="text-[#7B4B94] font-semibold group-hover:text-[#E84A8A] transition-colors">
                Discover Our Journey
              </span>
              <motion.div
                whileHover={{ scale: 1.1, x: 5 }}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E84A8A] shadow-lg shadow-[#E84A8A]/30"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Right - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 md:gap-5"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -6 }}
                className="group relative p-6 md:p-7 rounded-3xl bg-white border border-[#E84A8A]/15 shadow-lg shadow-[#E84A8A]/5 hover:shadow-xl hover:shadow-[#E84A8A]/10 transition-all duration-300 overflow-hidden"
              >
                {/* Glow on Hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl"
                  style={{ backgroundColor: feature.color }}
                />

                {/* Icon */}
                <div
                  className="relative inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl"
                  style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                >
                  <feature.icon className="w-6 h-6" />
                </div>

                {/* Text */}
                <h3 className="relative text-lg font-bold text-[#7B4B94] mb-1">
                  {feature.title}
                </h3>
                <p className="relative text-sm text-[#7B4B94]/60 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Corner Accent */}
                <div
                  className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: feature.color }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 md:mt-28 pt-12 border-t border-[#7B4B94]/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '5000+', label: 'Happy Customers', color: '#E84A8A' },
              { value: '50+', label: 'Unique Scents', color: '#5CC5B5' },
              { value: '100%', label: 'Natural Ingredients', color: '#F5A623' },
              { value: '4.9★', label: 'Average Rating', color: '#7B4B94' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="text-center"
              >
                <div
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-[#7B4B94]/60 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;
