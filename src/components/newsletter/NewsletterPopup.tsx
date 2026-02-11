import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Gift, Sparkles, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const NewsletterPopup = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<{ enabled: boolean; discount_percent: number } | null>(null);

    useEffect(() => {
        const checkNewsletter = async () => {
            // 0. Don't show on admin or login pages
            if (location.pathname.startsWith('/admin')) return;

            // 1. Check if user already dismissed/subscribed
            const hasSeen = localStorage.getItem('aura_newsletter_dismissed');
            if (hasSeen) return;

            // 2. Fetch settings from Supabase
            try {
                const { data, error } = await supabase
                    .from('store_settings')
                    .select('value')
                    .eq('key', 'newsletter_popup')
                    .single();

                if (error) throw error;
                const value = data.value as { enabled: boolean; discount_percent: number };
                setSettings(value);

                if (value.enabled) {
                    // Show after 5 seconds
                    const timer = setTimeout(() => {
                        setIsVisible(true);
                    }, 5000);
                    return () => clearTimeout(timer);
                }
            } catch (err) {
                console.error('Failed to fetch newsletter settings:', err);
            }
        };

        checkNewsletter();
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('aura_newsletter_dismissed', 'true');
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        console.log('Popup: Attempting to subscribe:', email);
        try {
            const { data, error } = await supabase
                .from('subscribers')
                .insert([{ email }]);

            if (error) {
                console.error('Popup: Subscription error:', error);
                if (error.code === '23505') {
                    toast.info('You are already subscribed!');
                } else {
                    throw error;
                }
            } else {
                console.log('Popup: Subscription successful:', data);
                toast.success('Welcome to the family! Check your email for your 10% discount.');
            }

            // Dismiss anyway after attempt
            handleDismiss();
        } catch (err: any) {
            console.error('Popup: Caught subscription error:', err);
            toast.error(err.message || 'Failed to subscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible || !settings?.enabled) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#FDF8F4] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                >
                    {/* Image/Design Section */}
                    <div className="w-full md:w-5/12 bg-gradient-to-tr from-[#7B4B94] to-[#E84A8A] p-8 flex flex-col items-center justify-center text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <Sparkles className="absolute top-10 left-10 w-20 h-20 rotate-12" />
                            <Sparkles className="absolute bottom-10 right-10 w-32 h-32 -rotate-12" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6">
                                <Gift className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold mb-2">Claim Your Gift</h3>
                            <p className="text-white/80 text-sm">Join our inner circle and unlock a premium experience.</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="w-full md:w-7/12 p-8 md:p-12 relative flex flex-col justify-center">
                        <button
                            onClick={handleDismiss}
                            className="absolute top-6 right-6 p-2 text-[#7B4B94]/40 hover:text-[#E84A8A] transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-[#7B4B94] mb-4">
                                Join the <span className="italic text-[#E84A8A]">Aura</span> Family
                            </h2>
                            <p className="text-[#7B4B94]/70">
                                Be the first to experience new senses, exclusive offers, and get <span className="text-[#E84A8A] font-bold">{settings.discount_percent}% OFF</span> your next order!
                            </p>
                        </div>

                        <form onSubmit={handleSubscribe} className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7B4B94]/30 group-focus-within:text-[#E84A8A] transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-[#E84A8A]/10 rounded-2xl py-4 pl-12 pr-4 text-[#7B4B94] focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/30 transition-all placeholder:text-[#7B4B94]/30"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#E84A8A] hover:bg-[#D43A7A] text-white h-14 rounded-2xl font-bold text-lg shadow-lg shadow-[#E84A8A]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Claim My 10% Discount'}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-xs text-[#7B4B94]/40">
                            By subscribing, you agree to our Terms and Privacy Policy.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default NewsletterPopup;
