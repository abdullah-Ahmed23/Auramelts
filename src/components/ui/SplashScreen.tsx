import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import logo from '@/assets/logo.jpeg';

const SplashScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FFF9F0]"
        >
            <div className="relative flex flex-col items-center">
                {/* Logo Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mb-8"
                >
                    <div className="absolute inset-0 rounded-full bg-[#E84A8A]/20 blur-xl animate-pulse" />
                    <img
                        src={logo}
                        alt="Aura Melts"
                        className="relative h-32 w-32 rounded-full object-cover shadow-2xl ring-4 ring-white/50"
                    />
                </motion.div>

                {/* Brand Name */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="font-heading text-4xl md:text-5xl font-bold tracking-[0.2em] text-[#7B4B94] mb-4"
                >
                    AURA MELTS
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-[#E84A8A] font-bold tracking-widest text-sm uppercase"
                >
                    Handcrafted Luxury Senses
                </motion.p>

                {/* Loader */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12"
                >
                    <Loader2 className="h-8 w-8 text-[#7B4B94]/30 animate-spin" />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SplashScreen;
