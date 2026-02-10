import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoImg from '../../assets/logo.jpeg';

const HeroSection = () => {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FDF8F4] via-[#FFF9F0] to-[#F5F0E6] pt-20">

      {/* Optimized Background Orbs - Reduced blur for mobile performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#E84A8A]/30 to-transparent blur-[40px] md:blur-[80px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-[#5CC5B5]/30 to-transparent blur-[40px] md:blur-[80px] animate-pulse duration-[10000ms]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#7B4B94]/20 to-transparent blur-[30px] md:blur-[60px] animate-pulse duration-[12000ms]" />
      </div>

      <div className="container relative mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">

            {/* Badge */}
            <div
              data-aos="fade-up"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-[#E84A8A]/20 shadow-xl shadow-[#E84A8A]/10"
            >
              <Sparkles className="w-4 h-4 text-[#E84A8A]" />
              <span className="text-sm font-bold text-[#7B4B94] uppercase tracking-wider">Handcrafted with Love</span>
            </div>

            {/* Main Heading */}
            <h1
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1]"
            >
              <span className="text-[#7B4B94]">Ignite Your </span>
              <span className="relative inline-block">
                <span className="text-[#E84A8A] italic font-serif">Senses</span>
                <div className="absolute -inset-4 bg-[#E84A8A]/20 blur-2xl -z-10 rounded-full animate-pulse" />
              </span>
            </h1>

            {/* Subtitle */}
            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#5CC5B5]"
            >
              with Pure Aura
            </p>

            {/* Description */}
            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="text-lg md:text-xl text-[#7B4B94]/70 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Experience the magic of hand-poured soy candles and wax melts, infused with premium botanicals to transform your space into a sanctuary of warmth and peace.
            </p>

            {/* CTA Buttons */}
            <div
              data-aos="fade-up"
              data-aos-delay="400"
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
            </div>

            {/* Social Proof */}
            <div
              data-aos="fade-up"
              data-aos-delay="500"
              className="flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-3">
                {['👩🏻', '👨🏽', '👩🏼', '👨🏻', '👩🏽'].map((emoji, i) => (
                  <div
                    key={i}
                    data-aos="zoom-in"
                    data-aos-delay={600 + i * 100}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E84A8A]/20 to-[#5CC5B5]/20 border-3 border-white flex items-center justify-center text-xl shadow-lg"
                  >
                    {emoji}
                  </div>
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
            </div>
          </div>

          {/* Right Visual */}
          <div
            data-aos="zoom-in"
            data-aos-delay="400"
            className="relative"
          >
            {/* Mobile: Simple Floating Logo */}
            <div className="block lg:hidden relative w-64 h-64 mx-auto animate-float">
              <div className="absolute inset-0 bg-[#E84A8A]/20 rounded-full blur-3xl animate-pulse" />
              <img
                src={logoImg}
                alt="Aura Melts Logo"
                className="w-full h-full object-cover rounded-full border-4 border-white/50 shadow-2xl relative z-10"
              />
            </div>

            {/* Desktop: Complex Interactive Visual */}
            <div className="hidden lg:block relative animate-float">
              {/* Main Circle */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E84A8A]/20 via-[#7B4B94]/10 to-[#5CC5B5]/20 rounded-full blur-3xl" />
                <div className="relative w-full h-full rounded-full bg-white/40 backdrop-blur-2xl border-4 border-white/60 shadow-2xl flex items-center justify-center overflow-hidden">

                  {/* Rotating Border */}
                  <div className="absolute inset-6 rounded-full border-2 border-dashed border-[#E84A8A]/30 animate-spin-slow" />

                  {/* Center Content */}
                  <div className="text-center z-10">
                    <div className="text-9xl mb-6 animate-pulse">
                      🕯️
                    </div>
                    <p className="text-3xl font-bold text-[#7B4B94] uppercase tracking-wider">Aura Melts</p>
                    <p className="text-base text-[#E84A8A]/70 mt-2">Premium Soy Candles</p>
                  </div>

                  {/* Floating Icons */}
                  <div className="absolute top-10 right-10 text-4xl animate-bounce duration-[3000ms]">
                    ✨
                  </div>
                  <div className="absolute bottom-16 left-10 text-3xl animate-bounce duration-[4000ms]">
                    🌸
                  </div>
                  <div className="absolute top-1/2 right-8 text-3xl animate-pulse">
                    💖
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FDF8F4] to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
