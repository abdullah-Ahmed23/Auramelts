import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Plus, Minus, Search } from 'lucide-react';
import { useState } from 'react';
import PageTransition from '@/components/PageTransition';

const faqs = [
  {
    q: 'What wax do you use for your candles?',
    a: 'All our candles are made with 100% nature wax. Nature wax burns cleaner and longer than paraffin, and is a renewable, biodegradable resource.',
  },
  {
    q: 'How long do your candles burn?',
    a: 'Burn times vary by size: Small (4oz) — approx. 25 hours, Medium (8oz) — approx. 50 hours, Large (12oz) — approx. 75 hours.',
  },
  {
    q: 'Are your products vegan and cruelty-free?',
    a: 'Yes! All Aura Melts products are 100% vegan, cruelty-free, and we never test on animals.',
  },
  {
    q: 'How should I care for my candle?',
    a: 'Trim the wick to 1/4 inch before each burn, allow the wax pool to reach the edges on the first burn, and never burn for more than 4 hours at a time.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Currently, we ship within Egypt and selected countries. We\'re working on expanding to more locations soon!',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 14 days of delivery for unused, unopened items in their original packaging. Please contact us to arrange a return.',
  },
  {
    q: 'Do you offer custom or bulk orders?',
    a: 'Yes! We love creating custom candles for weddings, events, and corporate gifts. Contact us with your requirements and we\'ll be happy to help.',
  },
  {
    q: 'How do I use wax melts?',
    a: 'Place one or two wax melt cubes in the dish of your wax melt burner. Light a tea light candle underneath (or use an electric burner). The wax will slowly melt and release fragrance. Allow to cool and solidify before discarding.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <Layout>
        <section className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-[#FDF8F4]">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5CC5B5]/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#E84A8A]/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="container relative mx-auto px-4 max-w-4xl z-10">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="text-[#E84A8A] font-bold tracking-widest text-xs uppercase mb-4 block">
                Support Center
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7B4B94] mb-6">
                Frequently Asked <span className="italic text-[#E84A8A] font-serif font-normal">Questions</span>
              </h1>
              <p className="text-[#7B4B94]/70 text-lg max-w-xl mx-auto mb-8">
                Find answers to common questions about our products, shipping, and care instructions.
              </p>

              {/* Search Bar */}
              <div className="max-w-md mx-auto relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-[#7B4B94]/40 group-focus-within:text-[#E84A8A] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border border-[#E84A8A]/10 rounded-full text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:border-[#E84A8A] focus:ring-4 focus:ring-[#E84A8A]/5 shadow-sm transition-all"
                />
              </div>
            </motion.div>

            {/* FAQ List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={`group rounded-2xl bg-white transition-all duration-300 border ${openIndex === index
                        ? 'border-[#E84A8A] shadow-lg shadow-[#E84A8A]/10'
                        : 'border-transparent shadow-sm hover:shadow-md hover:border-[#E84A8A]/30'
                        }`}
                    >
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      >
                        <span
                          className={`text-lg md:text-xl font-bold transition-colors pr-8 ${openIndex === index ? 'text-[#E84A8A]' : 'text-[#7B4B94]'
                            }`}
                        >
                          {faq.q}
                        </span>
                        <span
                          className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${openIndex === index
                            ? 'bg-[#E84A8A] text-white rotate-180'
                            : 'bg-[#FDF8F4] text-[#7B4B94] group-hover:bg-[#E84A8A]/10'
                            }`}
                        >
                          {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </span>
                      </button>

                      <motion.div
                        initial={false}
                        animate={{
                          height: openIndex === index ? 'auto' : 0,
                          opacity: openIndex === index ? 1 : 0
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <p className="text-[#7B4B94]/70 leading-relaxed border-t border-[#E84A8A]/10 pt-4">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#7B4B94]/60">No matching questions found.</p>
                </div>
              )}
            </motion.div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <p className="text-[#7B4B94] font-medium mb-4">Still have questions?</p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-[#E84A8A] font-bold border-b-2 border-[#E84A8A]/20 hover:border-[#E84A8A] hover:text-[#D43D7A] transition-all pb-0.5"
              >
                Contact our support team
              </a>
            </motion.div>

          </div>
        </section>
      </Layout>
    </PageTransition>
  );
};

export default FAQ;
