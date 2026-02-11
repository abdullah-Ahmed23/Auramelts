import React from 'react';
import Layout from '@/components/layout/Layout';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';

const Privacy = () => {
    return (
        <PageTransition>
            <Layout>
                <section className="relative pt-32 pb-20 bg-[#FDF8F4] overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#5CC5B5]/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E84A8A]/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

                    <div className="container mx-auto px-4 max-w-4xl relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-12 text-center"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-[#7B4B94] mb-6 font-heading">
                                Privacy <span className="italic text-[#E84A8A] font-serif font-normal">Policy</span>
                            </h1>
                            <p className="text-[#7B4B94]/70 text-lg max-w-2xl mx-auto">
                                At Aura Melts, we value your trust and are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-[#7B4B94]/5 border border-[#E84A8A]/10 space-y-10"
                        >
                            {/* Section 1 */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-[#7B4B94] flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#E84A8A]/10 flex items-center justify-center text-[#E84A8A] text-sm font-bold">1</span>
                                    Information We Collect
                                </h2>
                                <p className="text-[#7B4B94]/80 leading-relaxed pl-11">
                                    We collect information you provide directly to us when you make a purchase, create an account, or contact us. This includes:
                                </p>
                                <ul className="list-disc list-outside ml-16 space-y-2 text-[#7B4B94]/80">
                                    <li>Personal details (Name, Email, Phone Number, Shipping Address).</li>
                                    <li>Payment information (processed securely through our payment partners).</li>
                                    <li>Order history and preferences.</li>
                                </ul>
                            </div>

                            {/* Section 2 */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-[#7B4B94] flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#E84A8A]/10 flex items-center justify-center text-[#E84A8A] text-sm font-bold">2</span>
                                    How We Use Your Information
                                </h2>
                                <p className="text-[#7B4B94]/80 leading-relaxed pl-11">
                                    We use the information we collect to:
                                </p>
                                <ul className="list-disc list-outside ml-16 space-y-2 text-[#7B4B94]/80">
                                    <li>Process and fulfill your orders.</li>
                                    <li>Communicate with you about your order status.</li>
                                    <li>Send you updates, newsletters, and promotional offers (if you've opted in).</li>
                                    <li>Improve our website and customer service.</li>
                                </ul>
                            </div>

                            {/* Section 3 */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-[#7B4B94] flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#E84A8A]/10 flex items-center justify-center text-[#E84A8A] text-sm font-bold">3</span>
                                    Cookies & Tracking
                                </h2>
                                <p className="text-[#7B4B94]/80 leading-relaxed pl-11">
                                    We use cookies to enhance your browsing experience, analyze site traffic, and understand where our audience is coming from. You can choose to disable cookies through your browser settings, though this may affect some site functionality.
                                </p>
                            </div>

                            {/* Section 4 */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-[#7B4B94] flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#E84A8A]/10 flex items-center justify-center text-[#E84A8A] text-sm font-bold">4</span>
                                    Data Security
                                </h2>
                                <p className="text-[#7B4B94]/80 leading-relaxed pl-11">
                                    We implement a variety of security measures to maintain the safety of your personal information. Your personal data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
                                </p>
                            </div>

                            {/* Section 5 */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-[#7B4B94] flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#E84A8A]/10 flex items-center justify-center text-[#E84A8A] text-sm font-bold">5</span>
                                    Contact Us
                                </h2>
                                <p className="text-[#7B4B94]/80 leading-relaxed pl-11">
                                    If you have any questions regarding this privacy policy, you may contact us using the information below:
                                </p>
                                <div className="pl-11 pt-2">
                                    <p className="text-[#7B4B94] font-semibold">Aura Melts Support</p>
                                    <a href="mailto:support@auramelts.com" className="text-[#E84A8A] hover:underline">support@auramelts.com</a>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </section>
            </Layout>
        </PageTransition>
    );
};

export default Privacy;
