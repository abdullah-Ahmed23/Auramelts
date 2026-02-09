import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Loader2, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { logActivity } from '@/lib/logger';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { contactSchema } from '@/lib/validations';

const ContactSection = () => {
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate with Zod
        const result = contactSchema.safeParse(formData);
        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        // Check Turnstile token
        if (!turnstileToken) {
            toast.error('Please complete the security check');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase
                .from('messages')
                .insert([formData]);

            if (error) throw error;

            await logActivity('New Message', `Message received from ${formData.name} (${formData.email})`, 'create');

            toast.success('Message sent! We will get back to you soon.');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTurnstileToken(null);
            turnstileRef.current?.reset();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 md:py-28 bg-gradient-to-br from-[#FDF8F4] to-[#F5F0E6] relative overflow-hidden">
            {/* Background Elements - Optimized */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#5CC5B5]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#E84A8A]/10 rounded-full blur-[70px] pointer-events-none" />

            <div className="container relative mx-auto px-4 max-w-7xl z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left Side - Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#5CC5B5]/10 border border-[#5CC5B5]/20">
                                <Mail className="w-4 h-4 text-[#5CC5B5]" />
                                <span className="text-xs font-semibold tracking-wider uppercase text-[#5CC5B5]">Let's Connect</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-[#7B4B94] mb-6 leading-tight">
                                Get in <span className="italic text-[#E84A8A]">Touch</span>
                            </h2>

                            <p className="text-[#7B4B94]/60 text-lg mb-8">
                                Have a question or want to collaborate? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-6">
                            <motion.a
                                href="tel:+201018405310"
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 border border-[#E84A8A]/10 hover:border-[#E84A8A]/30 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#5CC5B5]/10 flex items-center justify-center group-hover:bg-[#5CC5B5]/20 transition-colors">
                                    <Phone className="w-6 h-6 text-[#5CC5B5]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#7B4B94]/60 font-medium">Phone</p>
                                    <p className="text-[#7B4B94] font-semibold">+20 10 18405310</p>
                                </div>
                            </motion.a>
                        </div>

                        {/* Social Media */}
                        <div>
                            <p className="text-[#7B4B94]/60 text-sm font-medium mb-4">Follow Us</p>
                            <div className="flex gap-3">
                                <motion.a
                                    href="#"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-12 h-12 rounded-xl bg-white border border-[#E84A8A]/20 flex items-center justify-center hover:bg-[#E84A8A]/10 transition-colors"
                                >
                                    <Instagram className="w-5 h-5 text-[#E84A8A]" />
                                </motion.a>
                                <motion.a
                                    href="#"
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    className="w-12 h-12 rounded-xl bg-white border border-[#5CC5B5]/20 flex items-center justify-center hover:bg-[#5CC5B5]/10 transition-colors"
                                >
                                    <Facebook className="w-5 h-5 text-[#5CC5B5]" />
                                </motion.a>
                                <motion.a
                                    href="#"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-12 h-12 rounded-xl bg-white border border-[#7B4B94]/20 flex items-center justify-center hover:bg-[#7B4B94]/10 transition-colors"
                                >
                                    <MessageCircle className="w-5 h-5 text-[#7B4B94]" />
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-[#7B4B94]/10 border border-[#E84A8A]/10"
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full rounded-xl border border-[#E84A8A]/15 bg-[#FDF8F4] px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/20 focus:border-[#E84A8A] transition-all"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full rounded-xl border border-[#E84A8A]/15 bg-[#FDF8F4] px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/20 focus:border-[#E84A8A] transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full rounded-xl border border-[#E84A8A]/15 bg-[#FDF8F4] px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/20 focus:border-[#E84A8A] transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                    className="w-full rounded-xl border border-[#E84A8A]/15 bg-[#FDF8F4] px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/20 focus:border-[#E84A8A] transition-all"
                                />
                            </div>

                            <textarea
                                placeholder="Your Message..."
                                required
                                rows={5}
                                value={formData.message}
                                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                className="w-full rounded-xl border border-[#E84A8A]/15 bg-[#FDF8F4] px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/20 focus:border-[#E84A8A] transition-all resize-none"
                            />

                            {/* Turnstile CAPTCHA */}
                            <div className="flex justify-center">
                                <Turnstile
                                    ref={turnstileRef}
                                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                                    onSuccess={setTurnstileToken}
                                    onError={() => setTurnstileToken(null)}
                                    onExpire={() => setTurnstileToken(null)}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#E84A8A] to-[#7B4B94] hover:shadow-lg hover:shadow-[#E84A8A]/30 font-semibold text-sm uppercase tracking-wider transition-all hover:scale-[1.02] disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Send Message <Send className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
