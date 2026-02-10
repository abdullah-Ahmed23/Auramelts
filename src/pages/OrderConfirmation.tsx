import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Printer, ArrowLeft, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('id');

    const [order, setOrder] = useState<any>(location.state?.order || null);
    const [items, setItems] = useState<any[]>(location.state?.items || []);
    const [loading, setLoading] = useState(!location.state?.order);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                if (!location.state?.order) navigate('/', { replace: true });
                return;
            }

            try {
                let fetchedOrder = null;

                // 1. Try Secure RPC (works for guest users)
                const { data: rpcData, error: rpcError } = await supabase
                    .rpc('get_order_details', { p_order_id: orderId });

                if (!rpcError && rpcData) {
                    fetchedOrder = rpcData;
                } else {
                    // 2. Fallback to standard select (works for admins/owners) if RPC fails/missing
                    console.log("RPC fetch failed, falling back to standard select:", rpcError?.message);
                    const { data: orderData, error: orderError } = await supabase
                        .from('orders')
                        .select('*, order_items:order_items(*, products:products(title:name, price, image))')
                        .eq('id', orderId)
                        .single();

                    if (orderError) throw orderError;
                    fetchedOrder = orderData;
                }

                if (!fetchedOrder) throw new Error("Order not found");

                setOrder(fetchedOrder);

                // Transform items to match expected structure
                setItems(fetchedOrder.order_items.map((item: any) => ({
                    ...item,
                    product: item.products, // Map nested product to expected prop
                    variant: item.variant_name ? { name: item.variant_name, price: item.price } : null // Construct minimal variant obj
                })));

            } catch (error) {
                console.error("Failed to load invoice:", error);
                // toast.error("Invoice not found");
                navigate('/', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        if (!order && orderId) {
            fetchOrder();
        } else if (!order && !orderId) {
            navigate('/', { replace: true });
        }
    }, [orderId, order, navigate, location.state]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDF8F4] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#7B4B94] animate-spin" />
            </div>
        );
    }

    if (!order) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#FDF8F4] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Navigation / Actions (Hidden in Print) */}
                <div className="mb-8 flex justify-between items-center print:hidden">
                    <Link to="/">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Button>
                    </Link>
                    <Button onClick={handlePrint} className="gap-2 bg-[#7B4B94] hover:bg-[#6A3A83] text-white">
                        <Printer className="w-4 h-4" /> Print Invoice
                    </Button>
                </div>

                {/* Invoice Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:border print:border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#7B4B94] to-[#E84A8A] p-8 text-white print:bg-none print:text-black print:border-b print:border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold font-heading mb-2">Order Confirmed!</h1>
                                <p className="opacity-90">Thank you for your purchase, {order.customer_name}.</p>
                            </div>
                            <div className="text-right">
                                <p className="font-mono text-lg opacity-80">Order ID</p>
                                <p className="font-mono text-xl font-bold">{order.id.slice(0, 8).toUpperCase()}</p>
                                <p className="text-sm opacity-75 mt-1">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Customer Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Billed To</h3>
                                <div className="space-y-1 text-gray-700">
                                    <p className="font-semibold text-lg">{order.customer_name}</p>
                                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {order.address}, {order.city}, {order.governorate}</p>
                                    <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {order.customer_phone}</p>
                                    <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {order.customer_email}</p>
                                </div>
                            </div>
                            <div className="md:text-right">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Payment Method</h3>
                                <p className="font-semibold text-lg capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'InstaPay / Wallet'}</p>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mt-2 ${order.is_paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    <CheckCircle className="w-3 h-3" />
                                    {order.is_paid ? 'Paid' : 'Payment Pending'}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="border rounded-lg overflow-hidden mb-8">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((item: any, index: number) => {
                                        // Check if item has product info nested (from checkout modal it might be nested under `product` or flattened)
                                        // Based on CheckoutModal logic: item has product_id, but the state passed might be the original cart items
                                        // Let's assume we pass the cart items structure
                                        const name = item.product?.title || "Product";
                                        const variant = item.variant?.name;
                                        const price = item.variant ? item.variant.price : item.product?.price || 0;
                                        const total = price * item.quantity;

                                        return (
                                            <tr key={index}>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{name}</div>
                                                    {variant && <div className="text-sm text-gray-500">{variant}</div>}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm text-gray-500">{item.quantity}</td>
                                                <td className="px-6 py-4 text-right text-sm text-gray-500">{price.toLocaleString()} EGP</td>
                                                <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">{total.toLocaleString()} EGP</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-gray-900">Total Amount</td>
                                        <td className="px-6 py-4 text-right text-lg font-bold text-[#E84A8A]">{order.total_amount.toLocaleString()} EGP</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Footer Message */}
                        <div className="text-center border-t pt-8">
                            <p className="text-gray-500 text-sm">
                                Need help? Call us at <a href="tel:+201018405310" className="text-[#7B4B94] font-semibold hover:text-[#E84A8A] transition-colors">+20 10 18405310</a>
                            </p>
                            <p className="mt-2 text-xs text-gray-400">Aura Melts - Handcrafted with Love</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
