import { motion } from 'framer-motion';
import { Star, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const FeedbackForm = () => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setName('');
            setRating(0);
            setFeedback('');
        }, 3000);
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

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-[#7B4B94]">2,500+</p>
                                <p className="text-sm text-[#E84A8A]/70">Happy Reviews</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-[#7B4B94]">4.9/5</p>
                                <p className="text-sm text-[#E84A8A]/70">Average Rating</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-[#7B4B94]">98%</p>
                                <p className="text-sm text-[#E84A8A]/70">Satisfaction</p>
                            </div>
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

                                {/* Star Rating */}
                                <div>
                                    <label className="block text-[#7B4B94] text-sm font-medium mb-3">
                                        Your Rating
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <motion.button
                                                key={`star-${star}-${star <= rating ? 'active' : 'inactive'}`}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setRating(star)}
                                                initial={{ rotate: 0, scale: 1 }}
                                                animate={star <= rating ? { rotate: 360, scale: [1, 1.3, 1] } : { rotate: 0, scale: 1 }}
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

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitted}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all ${isSubmitted
                                        ? 'bg-[#5CC5B5] text-white'
                                        : 'bg-gradient-to-r from-[#E84A8A] to-[#7B4B94] text-white hover:shadow-lg hover:shadow-[#E84A8A]/30'
                                        }`}
                                >
                                    {isSubmitted ? (
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
