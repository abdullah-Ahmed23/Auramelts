import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavHoverLinkProps {
    to: string;
    label: string;
    isActive: boolean;
    onClick?: () => void;
}

const RealisticFlower = ({ size = 14, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" className={`overflow-visible ${className}`}>
        <g transform="translate(10,10)">
            {[0, 72, 144, 216, 288].map((angle) => (
                <path
                    key={angle}
                    d="M0,0 C-4,-8 4,-8 0,0"
                    transform={`rotate(${angle})`}
                    fill="#FF85A1"
                    stroke="#FF5C8A"
                    strokeWidth="0.5"
                />
            ))}
            {/* Yellow Center */}
            <circle r="2.5" fill="#FFD700" stroke="#DAA520" strokeWidth="0.3" />
            {/* Center Details */}
            <circle cx="-0.5" cy="-0.5" r="0.4" fill="#DAA520" />
            <circle cx="0.5" cy="0.2" r="0.3" fill="#DAA520" />
            <circle cx="-0.2" cy="0.6" r="0.3" fill="#DAA520" />
        </g>
    </svg>
);

const FloatingFlowers = ({ count = 4 }: { count?: number }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => {
                const startX = (Math.random() - 0.5) * 120;
                const startY = (Math.random() - 0.5) * 60;
                const driftX = (Math.random() - 0.5) * 40;
                const driftY = (Math.random() - 0.5) * 30;

                return (
                    <motion.div
                        key={i}
                        className="absolute pointer-events-none"
                        initial={{ x: startX, y: startY, scale: 0, rotate: Math.random() * 360, opacity: 0 }}
                        animate={{
                            x: [startX, startX + driftX, startX - driftX],
                            y: [startY, startY + driftY, startY - driftY],
                            scale: [0.6, 0.9, 0.7],
                            rotate: [0, 180, 360],
                            opacity: [0.3, 0.5, 0.4]
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            duration: 5 + Math.random() * 3,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: "easeInOut",
                            delay: Math.random() * 0.5
                        }}
                        style={{ top: '50%', left: '50%', zIndex: 0 }}
                    >
                        <RealisticFlower size={10} />
                    </motion.div>
                );
            })}
        </>
    );
};

const Leaf = ({ className = "" }: { className?: string }) => (
    <motion.svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        className={`overflow-visible ${className}`}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
    >
        <path d="M5,10 C2,7 0,5 5,0 C5,0 8,3 5,10" fill="currentColor" opacity="0.6" />
        <path d="M5,10 C8,7 10,5 5,0 C5,0 2,3 5,10" fill="currentColor" opacity="0.4" />
    </motion.svg>
);

const BloomingVine = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
            <svg
                viewBox="0 0 100 40"
                className="absolute inset-0 h-full w-full overflow-visible"
                preserveAspectRatio="none"
            >
                <motion.path
                    d="M5,30 C5,10 40,5 50,5 S 95,10 95,20 S 60,35 50,35 S 5,30 15,25"
                    fill="none"
                    stroke="#4A6741"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                />
            </svg>

            <div className="absolute inset-0">
                <motion.div className="absolute" style={{ top: '75%', left: '5%' }} exit={{ scale: 0, opacity: 0 }}>
                    <RealisticFlower size={12} />
                </motion.div>

                <motion.div className="absolute" style={{ top: '15%', left: '25%' }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ delay: 0.3 }}>
                    <Leaf className="text-secondary/60" />
                </motion.div>

                <motion.div className="absolute" style={{ top: '5%', left: '50%' }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ delay: 0.6 }}>
                    <RealisticFlower size={14} />
                </motion.div>

                <motion.div className="absolute" style={{ top: '30%', left: '85%' }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ delay: 0.8 }}>
                    <Leaf className="text-secondary/60 rotate-45" />
                </motion.div>

                <motion.div className="absolute" style={{ top: '45%', left: '92%' }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ delay: 1 }}>
                    <RealisticFlower size={16} />
                </motion.div>
            </div>
        </div>
    );
};

const NavHoverLink = ({ to, label, isActive, onClick }: NavHoverLinkProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [hoverCount, setHoverCount] = useState(0);

    const handleMouseEnter = () => {
        setHoverCount(prev => prev + 1);
        setIsHovered(true);
    };

    return (
        <Link
            to={to}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative inline-flex items-center justify-center px-4 py-2 font-heading text-base font-bold tracking-[0.02em] transition-all duration-300 ${isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(255,133,161,0.5)]' : 'text-[#4A3B4E] hover:text-primary hover:drop-shadow-[0_0_5px_rgba(255,133,161,0.4)]'
                }`}
        >
            <span className="relative z-10">{label}</span>

            {/* Warm Background Pill - Kept for both state feedback */}
            <AnimatePresence>
                {(isHovered || isActive) && (
                    <motion.div
                        className="absolute inset-0 rounded-lg bg-primary/5"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                )}
            </AnimatePresence>

            {/* Floral Effects - ONLY on hover to fix persistence bug */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        key={`floral-${hoverCount}`}
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FloatingFlowers count={2} />
                        <BloomingVine />
                    </motion.div>
                )}
            </AnimatePresence>
        </Link>
    );
};

export default NavHoverLink;
