import { motion } from 'framer-motion';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
        q: 'Are your products vegan?',
        a: 'Yes! All Aura Melts products are 100% vegan, cruelty-free, and we never test on animals.',
    },
    {
        q: 'How should I care for my candle?',
        a: 'Trim the wick to 1/4 inch before each burn, allow the wax pool to reach the edges on the first burn, and never burn for more than 4 hours at a time.',
    },
];

const MiniFAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="relative py-24 overflow-hidden bg-[#FDF8F4]">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7B4B94]/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E84A8A]/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Header Section */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="sticky top-32"
                        >
                            <span className="text-[#E84A8A] font-bold tracking-widest text-xs uppercase mb-4 block">
                                Common Questions
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#7B4B94] mb-6 leading-tight">
                                Curious Minds <br />
                                <span className="italic font-serif font-normal text-[#E84A8A]">Want to Know</span>
                            </h2>
                            <p className="text-[#7B4B94]/70 text-lg mb-8 leading-relaxed">
                                Everything you need to know about our handcrafted nature wax candles and wax melts. Can't find the answer you're looking for?
                            </p>

                            <Link
                                to="/faq"
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-white border border-[#E84A8A]/20 rounded-full text-[#7B4B94] font-semibold hover:border-[#E84A8A] hover:bg-[#E84A8A] hover:text-white transition-all shadow-sm hover:shadow-xl hover:shadow-[#E84A8A]/20"
                            >
                                View All FAQs
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Accordion Questions */}
                    <div className="lg:col-span-7 space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div
                                    className={`group rounded-2xl bg-white transition-all duration-300 border ${openIndex === index
                                        ? 'border-[#E84A8A] shadow-lg shadow-[#E84A8A]/10'
                                        : 'border-transparent shadow-sm hover:shadow-md hover:border-[#E84A8A]/30'
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleAccordion(index)}
                                        className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                                    >
                                        <span
                                            className={`text-xl font-bold transition-colors ${openIndex === index ? 'text-[#E84A8A]' : 'text-[#7B4B94]'
                                                }`}
                                        >
                                            {faq.q}
                                        </span>
                                        <span
                                            className={`flex-shrink-0 ml-4 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${openIndex === index
                                                ? 'bg-[#E84A8A] text-white rotate-180'
                                                : 'bg-[#FDF8F4] text-[#7B4B94] group-hover:bg-[#E84A8A]/10'
                                                }`}
                                        >
                                            {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
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
                                        <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0">
                                            <p className="text-[#7B4B94]/70 leading-relaxed text-lg border-t border-[#E84A8A]/10 pt-4">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MiniFAQ;
