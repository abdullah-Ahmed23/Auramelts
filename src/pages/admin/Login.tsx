import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { loginSchema } from '@/lib/validations';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30000; // 30 seconds base

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);
    const navigate = useNavigate();

    // Brute-force protection state
    const [attempts, setAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
    const [lockoutRemaining, setLockoutRemaining] = useState(0);

    // Countdown timer for lockout
    useEffect(() => {
        if (!lockoutUntil) return;

        const interval = setInterval(() => {
            const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
            if (remaining <= 0) {
                setLockoutUntil(null);
                setLockoutRemaining(0);
            } else {
                setLockoutRemaining(remaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [lockoutUntil]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if locked out
        if (lockoutUntil && Date.now() < lockoutUntil) {
            toast.error(`Too many attempts. Try again in ${lockoutRemaining}s`);
            return;
        }

        // Validate with Zod
        const result = loginSchema.safeParse({ email, password });
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
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Increment attempts on failure
                const newAttempts = attempts + 1;
                setAttempts(newAttempts);

                if (newAttempts >= MAX_ATTEMPTS) {
                    // Exponential backoff: 30s, 60s, 120s...
                    const lockoutMs = LOCKOUT_DURATION * Math.pow(2, newAttempts - MAX_ATTEMPTS);
                    setLockoutUntil(Date.now() + lockoutMs);
                    toast.error(`Too many failed attempts. Locked out for ${lockoutMs / 1000}s`);
                }

                // Reset Turnstile on failure
                turnstileRef.current?.reset();
                setTurnstileToken(null);

                throw error;
            }

            // Check if user is admin
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profileError) {
                console.error('Profile fetch error:', profileError);
                if (profileError.code === 'PGRST116') {
                    toast.error('Profile not found. Please contact support or check database triggers.');
                } else {
                    toast.error(`Database error: ${profileError.message}`);
                }
                await supabase.auth.signOut();
                return;
            }

            if (profile?.role !== 'admin') {
                console.warn('Unauthorized login attempt:', { id: data.user.id, role: profile?.role });
                toast.error(`Access denied. Your role is '${profile?.role || 'unknown'}'. Admin required.`);
                await supabase.auth.signOut();
                return;
            }

            // Reset attempts on successful login
            setAttempts(0);
            setLockoutUntil(null);

            toast.success('Welcome back, Admin!');
            navigate('/admin');
        } catch (error: any) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const isLockedOut = lockoutUntil && Date.now() < lockoutUntil;

    return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[128px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 mx-auto mb-6 shadow-[0_0_40px_rgba(168,85,247,0.4)]" />
                    <h1 className="text-3xl font-bold text-white tracking-tight">Aura Dash Login</h1>
                    <p className="text-white/40 mt-2">Enter credentials to access the control panel.</p>
                </div>

                {/* Lockout Warning */}
                {isLockedOut && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <p className="text-red-300 text-sm">
                            Too many failed attempts. Try again in <span className="font-bold">{lockoutRemaining}s</span>
                        </p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl space-y-6 shadow-2xl">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                type="email"
                                placeholder="Admin Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/20"
                                required
                                disabled={isLockedOut}
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/20"
                                required
                                disabled={isLockedOut}
                            />
                        </div>
                    </div>

                    {/* Turnstile CAPTCHA */}
                    <div className="flex justify-center">
                        <Turnstile
                            ref={turnstileRef}
                            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                            onSuccess={setTurnstileToken}
                            onError={() => setTurnstileToken(null)}
                            onExpire={() => setTurnstileToken(null)}
                            options={{
                                theme: 'dark',
                            }}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || isLockedOut}
                        className="w-full bg-white text-black hover:bg-white/90 h-14 rounded-xl font-bold text-lg tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <span className="flex items-center gap-2">
                                Access Dashboard <ArrowRight className="w-5 h-5" />
                            </span>
                        )}
                    </Button>
                </form>

                <p className="text-center text-white/20 text-xs mt-8 font-mono">
                    SECURED CONNECTION • END-TO-END ENCRYPTED
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
