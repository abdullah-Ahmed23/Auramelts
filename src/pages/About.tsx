import { motion } from 'framer-motion';
import { Heart, Leaf, Sparkles, Sun, CheckCircle2, Sprout, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageTransition from '@/components/PageTransition';

const values = [
  { icon: Heart, title: 'Handcrafted with Love', desc: 'Every product is carefully hand-poured in small batches to ensure the highest quality.', color: '#E84A8A' },
  { icon: Leaf, title: 'Natural & Sustainable', desc: 'We use 100% nature wax, cotton wicks, and eco-friendly packaging materials.', color: '#5CC5B5' },
  { icon: Sparkles, title: 'Unique Fragrances', desc: 'Our scent blends are custom-crafted using premium essential oils and fragrance oils.', color: '#F5A623' },
  { icon: Sun, title: 'Slow Living', desc: 'We believe in taking time to enjoy life\'s simple pleasures — starting with a beautiful candle.', color: '#7B4B94' },
];

const stats = [
  { label: 'Nature Wax', value: '100%', icon: Leaf },
  { label: 'Handmade', value: 'Egy', icon: Heart },
  { label: 'Vegan Friendly', value: 'Yes', icon: Sprout },
  { label: 'Happy Customers', value: '150', icon: Star },
];

const About = () => {
  return (
    <PageTransition>
      <Layout>
        <section className="relative overflow-hidden bg-[#FDF8F4]">

          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#7B4B94]/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#E84A8A]/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

          <div className="container relative mx-auto px-4 max-w-6xl z-10 pt-32 pb-24 md:pt-48 md:pb-32">

            {/* Hero Section */}
            <motion.div
              className="text-center mb-24 md:mb-32 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-[#E84A8A]/20 text-[#E84A8A] font-bold text-sm uppercase tracking-widest mb-8 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Est. 2026</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold text-[#7B4B94] mb-8 leading-tight tracking-tight">
                Crafting warmth, <br />
                <span className="italic font-serif font-normal text-[#E84A8A]">igniting memories.</span>
              </h1>

              <p className="text-lg md:text-xl text-[#7B4B94]/70 leading-relaxed max-w-2xl mx-auto">
                Aura Melts started with a simple idea: that a scent can transform a house into a home.
                We blend art, nature, and science to create candles that don't just smell good — they feel good.
              </p>
            </motion.div>

            {/* Stats Banner */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-32"
            >
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#E84A8A]/10 text-center shadow-lg shadow-[#7B4B94]/5 hover:transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="inline-flex p-3 rounded-full bg-[#FDF8F4] mb-3 text-[#E84A8A]">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-[#7B4B94] mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-[#7B4B94]/50 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* The Story - Split Layout */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-32">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#E84A8A]/20 to-transparent rounded-[2rem] transform rotate-3 scale-105 blur-sm" />
                <div className="relative bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-[#7B4B94]/10 border border-[#E84A8A]/10">
                  <h3 className="text-3xl font-bold text-[#7B4B94] mb-6">Our Lab <br />To Your Home</h3>
                  <div className="space-y-4 text-[#7B4B94]/80 leading-relaxed">
                    <p>
                      It started as a weekend hobby in a tiny room, experimenting with essential oils and melted wax.
                      We were tired of mass-produced candles that gave us headaches or lost their scent after one burn.
                    </p>
                    <p>
                      We wanted something better. Cleaner. More intentional.
                    </p>
                    <p>
                      Countless test batches later, we found our perfect blend: 100% nature wax, clean fragrances,
                      and cotton wicks. No shortcuts, no additives, just pure, consistent burn.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                {[
                  "Meticulously hand-poured in small batches",
                  "Sustainably sourced ingredients",
                  "Fragrances designed to evoke emotion",
                  "Plastic-free, recyclable packaging"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5CC5B5]/10 flex items-center justify-center text-[#5CC5B5] group-hover:bg-[#5CC5B5] group-hover:text-white transition-colors duration-300">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-xl text-[#7B4B94] font-medium pt-1.5">{item}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Values Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-16">
                <span className="text-[#E84A8A] font-bold tracking-widest text-xs uppercase mb-4 block">Our Philosophy</span>
                <h2 className="text-4xl font-bold text-[#7B4B94]">What Drives Us</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group relative bg-white rounded-3xl p-8 border border-transparent hover:border-[#E84A8A]/20 shadow-lg shadow-[#7B4B94]/5 hover:shadow-2xl hover:shadow-[#E84A8A]/10 transition-[border-color,box-shadow] duration-300 overflow-hidden"
                  >
                    <div
                      className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-current opacity-5 rounded-bl-[100px] transition-opacity group-hover:opacity-10"
                      style={{ color: value.color }}
                    />

                    <div
                      className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110 duration-300"
                      style={{ backgroundColor: `${value.color}15`, color: value.color }}
                    >
                      <value.icon className="h-7 w-7" />
                    </div>

                    <h3 className="mb-3 text-xl font-bold text-[#7B4B94]">{value.title}</h3>
                    <p className="text-[#7B4B94]/60 leading-relaxed text-sm">{value.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </section>
      </Layout>
    </PageTransition>
  );
};

export default About;
