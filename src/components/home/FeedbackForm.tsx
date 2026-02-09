import { motion } from 'framer-motion';
import { Star, Send, MessageSquare, Loader2, MapPin } from 'lucide-react';
import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { feedbackSchema } from '@/lib/validations';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { logActivity } from '@/lib/logger';

const EGYPTIAN_CITIES = [
    "Cairo", "Giza", "Alexandria", "Port Said", "Suez", "Luxor", "Aswan",
    "Tanta", "Mansoura", "Fayoum", "Zagazig", "Ismailia", "Kafr El Sheikh",
    "Assiut", "Banha", "Beni Suef", "Sohag", "Hurghada", "Sharm El Sheikh",
    "Minya", "Qena", "New Cairo", "6th of October", "Helwan"
].sort();

const FeedbackForm = () => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [location, setLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate with Zod
        const result = feedbackSchema.safeParse({ name, rating, comment: feedback });
        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        // Check Turnstile token
        if (!turnstileToken) {
            toast.error('Please complete the security check');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('testimonials').insert([
                {
                    name,
                    rating,
                    feedback,
                    location: location ? `${location}, Egypt` : undefined
                }
            ]);

            if (error) throw error;

            await logActivity('New Review', `${name} rated ${rating}/5 stars`, 'create');

            setIsSubmitted(true);
            toast.success('Thank you for your feedback!');

            setTimeout(() => {
                setIsSubmitted(false);
                setName('');
                setRating(0);
                setFeedback('');
                setLocation('');
                setTurnstileToken(null);
                turnstileRef.current?.reset();
            }, 3000);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative py-20 md:py-28 overflow-hidden bg-[#FDF8F4]">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#7B4B94]/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#E84A8A]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative mx-auto px-4 max-w-6xl z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side - Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#5CC5B5]/10 border border-[#5CC5B5]/20">
                            <MessageSquare className="w-4 h-4 text-[#5CC5B5]" />
                            <span className="text-xs font-semibold tracking-wider uppercase text-[#5CC5B5]">Share Your Thoughts</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-[#7B4B94] mb-6 leading-tight">
                            We Value Your <span className="italic text-[#E84A8A]">Feedback</span>
                        </h2>

                        <p className="text-[#7B4B94]/60 text-lg mb-8 max-w-md mx-auto lg:mx-0">
                            Help us improve your experience. Every word is a reflection of our commitment to excellence.
                        </p>

                        {/* Floating Stars */}
                        <div className="relative h-32">
                            <motion.div
                                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute top-0 left-10 text-4xl"
                            >
                                ⭐
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                                className="absolute top-8 left-32 text-3xl"
                            >
                                ✨
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -25, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                                className="absolute top-4 right-20 text-5xl"
                            >
                                🌟
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -18, 0], rotate: [0, 15, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}
                                className="absolute bottom-0 left-1/2 text-3xl"
                            >
                                ⭐
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
                                className="absolute top-12 right-8 text-2xl"
                            >
                                ✨
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Side - Form Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-[#7B4B94]/10 border border-[#E84A8A]/10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-[#7B4B94] text-sm font-medium mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full bg-[#FDF8F4] border border-[#E84A8A]/15 hover:border-[#E84A8A]/30 focus:border-[#E84A8A] rounded-xl px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/10 transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                {/* Location Input (Egyptian Cities) */}
                                <div>
                                    <label className="block text-[#7B4B94] text-sm font-medium mb-2">
                                        Location <span className="text-[#7B4B94]/40 font-normal">(Optional)</span>
                                    </label>
                                    <Select value={location} onValueChange={setLocation}>
                                        <SelectTrigger className="w-full bg-[#FDF8F4] border-[#E84A8A]/15 h-[50px] rounded-xl text-[#7B4B94]">
                                            <SelectValue placeholder="Select your city" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px] overflow-y-auto">
                                            {EGYPTIAN_CITIES.map((city) => (
                                                <SelectItem key={city} value={city}>
                                                    {city}, Egypt
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Star Rating */}
                                <div>
                                    <label className="block text-[#7B4B94] text-sm font-medium mb-3">
                                        Your Rating
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <motion.button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                initial={{ rotate: 0, scale: 1 }}
                                                animate={
                                                    star <= rating && rating >= 4
                                                        ? { rotate: 360, scale: [1, 1.3, 1] }
                                                        : { rotate: 0, scale: 1 }
                                                }
                                                whileHover={{ scale: 1.2 }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                                className="cursor-pointer p-1"
                                            >
                                                <Star
                                                    className={`w-8 h-8 transition-colors ${star <= rating
                                                        ? 'text-[#F5A623] fill-[#F5A623]'
                                                        : 'text-[#E84A8A]/20'
                                                        }`}
                                                />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Feedback Textarea */}
                                <div>
                                    <label className="block text-[#7B4B94] text-sm font-medium mb-2">
                                        Your Feedback
                                    </label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full bg-[#FDF8F4] border border-[#E84A8A]/15 hover:border-[#E84A8A]/30 focus:border-[#E84A8A] rounded-xl px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/10 resize-none transition-all"
                                        placeholder="Share your experience with us..."
                                    />
                                </div>

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

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting || isSubmitted}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all ${isSubmitted
                                        ? 'bg-[#5CC5B5] text-white'
                                        : 'bg-gradient-to-r from-[#E84A8A] to-[#7B4B94] text-white hover:shadow-lg hover:shadow-[#E84A8A]/30'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : isSubmitted ? (
                                        <>Thank you! ✨</>
                                    ) : (
                                        <>
                                            Submit Feedback
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeedbackForm;
