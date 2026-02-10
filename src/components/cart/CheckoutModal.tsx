import { useState, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CreditCard, Banknote, Smartphone, Wallet, MapPin, User, Mail, Phone } from 'lucide-react';
import { logActivity } from '@/lib/logger';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { checkoutSchema } from '@/lib/validations';
import { motion } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const EGYPTIAN_GOVERNORATES = [
    "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbiya", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", "Sharqia", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Luxor", "Qena", "North Sinai", "Sohag", "South Sinai", "Kafr El Sheikh", "Matrouh"
].sort();

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
    const { items, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        governorate: '',
        city: '',
        paymentMethod: 'cod' as 'cod' | 'instapay'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentMethodChange = (method: 'cod' | 'instapay') => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate with Zod
        const result = checkoutSchema.safeParse(formData);
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
            // 1. Call Secure Edge Function
            const { data, error } = await supabase.functions.invoke('create-order', {
                body: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    governorate: formData.governorate,
                    city: formData.city,
                    payment_method: formData.paymentMethod,
                    items: items.map(item => ({
                        product_id: item.product.id,
                        quantity: item.quantity,
                        price: item.variant ? item.variant.price : item.product.price,
                        variant_name: item.variant?.name
                    })),
                    total_amount: totalPrice,
                    turnstile_token: turnstileToken
                }
            });

            if (error) {
                console.error('Edge Function Error:', error);
                throw new Error(error.message || 'Server validation failed');
            }

            if (!data?.success) {
                console.error('Order creation failed:', data);
                throw new Error(data?.error || 'Failed to create order');
            }

            const orderId = data.order_id;

            // Success
            // Note: Activity logging is now handled by Database Triggers (secure_activity_logs.sql)
            // await logActivity('New Order', `Order #${orderId} placed`, 'create'); 

            // Success
            // Note: Activity logging is now handled by Database Triggers (secure_activity_logs.sql)
            // await logActivity('New Order', `Order #${orderId} placed`, 'create'); 

            toast.success('Order placed successfully!');
            clearCart();
            setTurnstileToken(null);
            turnstileRef.current?.reset();
            onClose();

            // Navigate to Order Confirmation / Invoice
            navigate('/order-confirmation', {
                state: {
                    order: {
                        id: orderId,
                        created_at: new Date().toISOString(),
                        total_amount: totalPrice,
                        is_paid: false,
                        // Map form data to database column names
                        customer_name: formData.name,
                        customer_email: formData.email,
                        customer_phone: formData.phone,
                        address: formData.address,
                        governorate: formData.governorate,
                        city: formData.city,
                        payment_method: formData.paymentMethod
                    },
                    items: items
                }
            });

        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Failed to place order. Please try again.');

            // Reset Turnstile on error so user can try again
            setTurnstileToken(null);
            turnstileRef.current?.reset();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-[#FDF8F4] border-[#E84A8A]/10 text-[#7B4B94] p-0 overflow-hidden shadow-2xl shadow-[#7B4B94]/20 max-h-[90vh] flex flex-col">
                <div className="overflow-y-auto flex-1 p-6">
                    <DialogHeader className="mb-6 text-center space-y-3">
                        <DialogTitle className="text-3xl font-heading font-bold text-[#7B4B94]">
                            Secure <span className="text-[#E84A8A] italic">Checkout</span>
                        </DialogTitle>
                        <DialogDescription className="text-[#7B4B94]/70 text-base">
                            Complete your purchase of <span className="font-semibold text-[#7B4B94]">{items.length} items</span>.
                            <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E84A8A]/10 border border-[#E84A8A]/20">
                                <span className="text-sm font-medium text-[#7B4B94]">Total:</span>
                                <span className="font-bold text-[#E84A8A] text-lg">{totalPrice.toLocaleString()} EGP</span>
                            </div>
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#7B4B94]/40 flex items-center gap-2">
                                <User className="w-4 h-4" /> Contact Information
                            </h3>

                            <div className="grid gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-semibold text-[#7B4B94]/80 ml-1">Full Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="pl-10 h-11 bg-white border-[#E84A8A]/50 focus:border-[#E84A8A] focus:ring-[#E84A8A]/20 rounded-xl shadow-sm placeholder:text-[#7B4B94]/50"
                                        />
                                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#7B4B94]/30" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="phone" className="text-xs font-semibold text-[#7B4B94]/80 ml-1">Phone</Label>
                                        <div className="relative">
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                required
                                                placeholder="01xxxxxxxxx"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="pl-10 h-11 bg-white border-[#E84A8A]/50 focus:border-[#E84A8A] focus:ring-[#E84A8A]/20 rounded-xl shadow-sm placeholder:text-[#7B4B94]/50"
                                            />
                                            <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#7B4B94]/30" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="text-xs font-semibold text-[#7B4B94]/80 ml-1">Email</Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="pl-10 h-11 bg-white border-[#E84A8A]/50 focus:border-[#E84A8A] focus:ring-[#E84A8A]/20 rounded-xl shadow-sm placeholder:text-[#7B4B94]/50"
                                            />
                                            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#7B4B94]/30" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#7B4B94]/40 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Delivery Details
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="governorate" className="text-xs font-semibold text-[#7B4B94]/80 ml-1">Governorate</Label>
                                    <Select
                                        value={formData.governorate}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, governorate: value }))}
                                    >
                                        <SelectTrigger className="h-11 bg-white border-[#E84A8A]/50 focus:border-[#E84A8A] focus:ring-[#E84A8A]/20 rounded-xl shadow-sm text-[#7B4B94]">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EGYPTIAN_GOVERNORATES.map(gov => (
                                                <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="city" className="text-xs font-semibold text-[#7B4B94]/80 ml-1">City / Area</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        required
                                        placeholder="City name"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="h-11 bg-white border-[#E84A8A]/50 focus:border-[#E84A8A] focus:ring-[#E84A8A]/20 rounded-xl shadow-sm placeholder:text-[#7B4B94]/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="address" className="text-xs font-semibold text-[#7B4B94]/80 ml-1">Full Address</Label>
                                <div className="relative">
                                    <Input
                                        id="address"
                                        name="address"
                                        required
                                        placeholder="Street name, Building No, Apartment..."
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="pl-10 h-11 bg-white border-[#E84A8A]/50 focus:border-[#E84A8A] focus:ring-[#E84A8A]/20 rounded-xl shadow-sm placeholder:text-[#7B4B94]/50"
                                    />
                                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#7B4B94]/30" />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#7B4B94]/40 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" /> Payment Method
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                <div
                                    onClick={() => handlePaymentMethodChange('cod')}
                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2
                                        ${formData.paymentMethod === 'cod'
                                            ? 'bg-white border-[#E84A8A] shadow-md shadow-[#E84A8A]/10'
                                            : 'bg-white/50 border-transparent hover:bg-white hover:border-[#E84A8A]/30'}`}
                                >
                                    <Banknote className={`w-8 h-8 ${formData.paymentMethod === 'cod' ? 'text-[#E84A8A]' : 'text-[#7B4B94]/40'}`} />
                                    <span className={`text-sm font-bold ${formData.paymentMethod === 'cod' ? 'text-[#E84A8A]' : 'text-[#7B4B94]/60'}`}>
                                        Cash on Delivery
                                    </span>
                                    {formData.paymentMethod === 'cod' && (
                                        <motion.div layoutId="check" className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E84A8A]" />
                                    )}
                                </div>

                                <div
                                    onClick={() => handlePaymentMethodChange('instapay')}
                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center
                                        ${formData.paymentMethod === 'instapay'
                                            ? 'bg-white border-[#E84A8A] shadow-md shadow-[#E84A8A]/10'
                                            : 'bg-white/50 border-transparent hover:bg-white hover:border-[#E84A8A]/30'}`}
                                >
                                    <div className="flex gap-1">
                                        <Smartphone className={`w-8 h-8 ${formData.paymentMethod === 'instapay' ? 'text-[#E84A8A]' : 'text-[#7B4B94]/40'}`} />
                                        <Wallet className={`w-8 h-8 ${formData.paymentMethod === 'instapay' ? 'text-[#E84A8A]' : 'text-[#7B4B94]/40'}`} />
                                    </div>
                                    <span className={`text-sm font-bold leading-tight ${formData.paymentMethod === 'instapay' ? 'text-[#E84A8A]' : 'text-[#7B4B94]/60'}`}>
                                        InstaPay / E-Wallet
                                    </span>
                                    {formData.paymentMethod === 'instapay' && (
                                        <motion.div layoutId="check" className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E84A8A]" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Turnstile CAPTCHA */}
                        <div className="flex justify-center py-2">
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
                            className="w-full h-14 rounded-xl bg-gradient-to-r from-[#E84A8A] to-[#7B4B94] hover:shadow-lg hover:shadow-[#E84A8A]/25 text-white font-bold text-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            Place Order
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog >
    );
};

export default CheckoutModal;
