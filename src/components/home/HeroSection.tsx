import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/products';

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const dragX = useMotionValue(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % categories.length);
    }, 3500); // Switch every 3.5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const onDragStart = () => {
    setIsAutoPlaying(false);
  };

  const onDragEnd = (_: any, info: any) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      prevSlide();
    } else if (info.offset.x < -threshold) {
      nextSlide();
    }

    // Resume auto-play after a delay
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <section className="relative min-h-[79vh] py-20 overflow-hidden bg-[#FFF9F0] flex items-center pt-32">

      {/* Dynamic Aura Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] h-[60%] w-[60%] rounded-full bg-[#72C7B3]/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, -50, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[5%] h-[70%] w-[70%] rounded-full bg-[#FF85A1]/20 blur-[130px]"
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[50%] w-[50%] rounded-full bg-[#FFD700]/10 blur-[100px]"
        />
      </div>

      <div className="container relative mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-center text-center lg:text-left">

          {/* Content Column */}
          <div className="max-w-2xl mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center lg:justify-start gap-2 mb-6"
            >
              <span className="rounded-full bg-primary/10 px-5 py-2 text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2 shadow-sm border border-primary/10">
                <Sparkles className="h-3 w-3" />
                Handcrafted with Love
              </span>
            </motion.div>

            <motion.h1
              className="mb-8 font-heading text-4xl font-bold leading-[1.1] text-[#4A3B4E] md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Ignite Your <span className="text-[#FF85A1] italic">Senses</span> <br />
              with <span className="text-[#72C7B3]">Pure Aura</span>
            </motion.h1>

            <motion.p
              className="mb-10 text-base leading-relaxed text-[#4A3B4E]/80 md:text-xl font-light tracking-wide max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience the magic of hand-poured soy candles and wax melts,
              infused with premium botanicals to transform your space into a
              sanctuary of warmth and peace.
            </motion.p>



            {/* Social Proof Placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 flex items-center justify-center lg:justify-start gap-4 text-[#8E5B6F]/60"
            >
              <div className="flex -space-x-3">
                {['👩🏻', '👨🏽', '👩🏼', '👨🏻'].map((emoji, i) => (
                  <div key={i} className="h-10 w-10 rounded-full bg-[#F5E6D3] border-2 border-[#FFF9F0] flex items-center justify-center text-lg shadow-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium">Join 2,000+ scent lovers</span>
            </motion.div>
          </div>

          {/* Visual Column - Carousel */}
          <div className="relative group block">
            <motion.div
              className="relative aspect-square max-w-[320px] lg:max-w-[400px] xl:max-w-[500px] mx-auto cursor-grab active:cursor-grabbing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              style={{ x: dragX }}
            >
              {/* Rotating Borders Base */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-2 border-dashed border-[#FF85A1]/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-[50%_40%_30%_70%/50%_60%_40%_60%] border border-[#72C7B3]/40"
              />

              {/* Center Image Container - Dynamic Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-8 rounded-full overflow-hidden bg-gradient-to-br from-[#FF85A1]/10 to-[#72C7B3]/10 shadow-2xl flex items-center justify-center border-4 border-white/50 backdrop-blur-sm"
                >
                  {/* Internal Glow Flare */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-white/20 rounded-full blur-3xl pointer-events-none"
                  />

                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="text-center relative z-10"
                  >
                    <span className="text-6xl md:text-8xl drop-shadow-md select-none">{categories[index].icon}</span>
                    <div className="mt-4 text-[#8E5B6F] font-heading font-bold text-lg md:text-2xl uppercase tracking-[0.2em] italic opacity-60">
                      {categories[index].name} Bloom
                    </div>
                    <Link
                      to={`/products?category=${categories[index].id}`}
                      className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest text-[#72C7B3] hover:text-primary transition-colors"
                    >
                      Explore Ritual
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Floating Accents */}
              <motion.div
                className="absolute top-0 right-10 text-2xl md:text-4xl"
                animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute bottom-1/4 left-0 text-2xl md:text-3xl"
                animate={{ y: [0, 15, 0], rotate: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                🌸
              </motion.div>
              <motion.div
                className="absolute top-1/2 -right-4 text-xl md:text-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                💖
              </motion.div>

              {/* Pagination Bullets - MOVED INSIDE AND CENTERED */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3">
                {categories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`transition-all duration-500 rounded-full ${i === index ? 'w-8 bg-primary h-1.5' : 'w-2 bg-[#E6C9C9] h-1.5'}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Wave transition or bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FFF9F0] to-transparent" />
    </section>
  );
};

export default HeroSection;
