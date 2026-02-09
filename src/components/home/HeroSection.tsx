import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FDF8F4] via-[#FFF9F0] to-[#F5F0E6] pt-20">

      {/* Optimized Background Orbs - Reduced blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#E84A8A]/30 to-transparent blur-[80px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-[#5CC5B5]/30 to-transparent blur-[80px]"
        />
        <motion.div
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#7B4B94]/20 to-transparent blur-[60px]"
        />
      </div>

      <div className="container relative mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-[#E84A8A]/20 shadow-xl shadow-[#E84A8A]/10"
            >
              <Sparkles className="w-4 h-4 text-[#E84A8A]" />
              <span className="text-sm font-bold text-[#7B4B94] uppercase tracking-wider">Handcrafted with Love</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1]"
            >
              <span className="text-[#7B4B94]">Ignite Your </span>
              <span className="relative inline-block">
                <span className="text-[#E84A8A] italic font-serif">Senses</span>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-4 bg-[#E84A8A]/20 blur-2xl -z-10 rounded-full"
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#5CC5B5]"
            >
              with Pure Aura
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-[#7B4B94]/70 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Experience the magic of hand-poured soy candles and wax melts, infused with premium botanicals to transform your space into a sanctuary of warmth and peace.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                className="h-16 px-10 rounded-full bg-gradient-to-r from-[#E84A8A] to-[#D43D7A] hover:from-[#D43D7A] hover:to-[#C32C6A] text-white font-bold text-lg shadow-2xl shadow-[#E84A8A]/40 hover:shadow-[#E84A8A]/60 transition-all hover:scale-105 group"
              >
                <Link to="/products" className="inline-flex items-center gap-3">
                  Shop Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-16 px-10 rounded-full border-2 border-[#7B4B94]/30 bg-white/60 backdrop-blur-sm hover:bg-white/90 text-[#7B4B94] font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <Link to="/about">
                  Our Story
                </Link>
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-3">
                {['👩🏻', '👨🏽', '👩🏼', '👨🏻', '👩🏽'].map((emoji, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.1, type: "spring" }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E84A8A]/20 to-[#5CC5B5]/20 border-3 border-white flex items-center justify-center text-xl shadow-lg"
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" />
                  ))}
                </div>
                <a
                  href="#testimonials"
                  className="text-sm font-bold text-[#7B4B94] hover:text-[#E84A8A] transition-colors cursor-pointer"
                >
                  Show Testimonials →
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Main Circle */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E84A8A]/20 via-[#7B4B94]/10 to-[#5CC5B5]/20 rounded-full blur-3xl" />
                <div className="relative w-full h-full rounded-full bg-white/40 backdrop-blur-2xl border-4 border-white/60 shadow-2xl flex items-center justify-center overflow-hidden">

                  {/* Rotating Border */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-6 rounded-full border-2 border-dashed border-[#E84A8A]/30"
                  />

                  {/* Center Content */}
                  <div className="text-center z-10">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="text-9xl mb-6"
                    >
                      🕯️
                    </motion.div>
                    <p className="text-3xl font-bold text-[#7B4B94] uppercase tracking-wider">Aura Melts</p>
                    <p className="text-base text-[#E84A8A]/70 mt-2">Premium Soy Candles</p>
                  </div>

                  {/* Floating Icons */}
                  <motion.div
                    animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-10 right-10 text-4xl"
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute bottom-16 left-10 text-3xl"
                  >
                    🌸
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute top-1/2 right-8 text-3xl"
                  >
                    💖
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FDF8F4] to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
