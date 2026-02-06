import { motion } from 'framer-motion';
import { Send, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Newsletter = () => {
  return (
    <section className="py-24 md:py-32 bg-[#F5F0E6] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5CC5B5]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#E84A8A]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Decorations */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-[15%] text-3xl opacity-40 hidden md:block"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-24 right-[10%] text-2xl opacity-40 hidden md:block"
      >
        🕯️
      </motion.div>

      <div className="container relative mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl rounded-[2.5rem] bg-white border border-[#E84A8A]/15 p-10 text-center md:p-16 shadow-xl shadow-[#E84A8A]/10"
        >
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="h-16 w-16 rounded-2xl bg-[#5CC5B5]/15 flex items-center justify-center text-[#5CC5B5] shadow-md border border-[#5CC5B5]/20"
            >
              <Mail className="h-8 w-8" />
            </motion.div>
          </div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-4xl font-bold text-[#7B4B94] md:text-5xl"
          >
            Join the <span className="italic text-[#E84A8A]">Aura</span> Family
          </motion.h2>

          <p className="mb-10 text-[#7B4B94]/70 text-lg max-w-xl mx-auto leading-relaxed">
            Be the first to know about new scents, exclusive offers, and candle care tips.
            Join our community and get <span className="text-[#E84A8A] font-semibold">10% off</span> your first order!
          </p>

          {/* Form */}
          <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-full border border-[#E84A8A]/20 bg-[#FDF8F4] px-6 py-4 text-sm text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/30 focus:border-[#E84A8A]/50 transition-all"
            />
            <Button className="h-14 rounded-full px-8 bg-[#E84A8A] hover:bg-[#D43D7A] font-semibold shadow-lg shadow-[#E84A8A]/30 transition-all hover:scale-105 hover:-translate-y-0.5" size="lg">
              <Send className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </div>

          {/* Footer Note */}
          <div className="mt-10 flex items-center justify-center gap-2 text-[#7B4B94]/50">
            <Sparkles className="w-4 h-4" />
            <p className="text-xs uppercase tracking-[0.15em] font-medium">
              No spam. Just magic. Unsubscribe anytime.
            </p>
            <Sparkles className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
