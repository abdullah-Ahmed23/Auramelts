
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Phone, Mail, Trash2, ExternalLink, Image as ImageIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

interface OrderDetailsModalProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
    onOrderUpdated: () => void;
}

const OrderDetailsModal = ({ order, isOpen, onClose, onOrderUpdated }: OrderDetailsModalProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Generate Signed URL for Payment Proof
    const [proofUrl, setProofUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchProofUrl = async () => {
            if (order?.payment_proof) {
                // If it's a full URL, use it (might be old logic or public bucket)
                if (order.payment_proof.startsWith('http')) {
                    setProofUrl(order.payment_proof);
                    // Try to sign it anyway if it's from our bucket to be safe? 
                    // Actually, if it's a private bucket, we need to extract the path.
                    // Assuming payment_proof stores the full public URL from previous logic,
                    // we might need to extract the path if we want to sign it.
                    // But if the bucket is now private, the old public URL won't work.
                    // Let's assume the path is the last part or we need to handle both.

                    // IF the logic stored the Full Public URL:
                    // https://.../storage/v1/object/public/payment-proofs/filename.jpg
                    // We need 'filename.jpg'

                    try {
                        const url = new URL(order.payment_proof);
                        const pathParts = url.pathname.split('/');
                        const fileName = pathParts[pathParts.length - 1];

                        const { data } = await supabase
                            .storage
                            .from('payment-proofs')
                            .createSignedUrl(fileName, 60 * 60);

                        if (data) setProofUrl(data.signedUrl);
                        else setProofUrl(order.payment_proof); // Fallback
                    } catch (e) {
                        setProofUrl(order.payment_proof);
                    }
                } else {
                    // It's just a path/filename
                    const { data } = await supabase
                        .storage
                        .from('payment-proofs')
                        .createSignedUrl(order.payment_proof, 60 * 60);

                    if (data) {
                        setProofUrl(data.signedUrl);
                    }
                }
            }
        };

        if (isOpen && order?.payment_proof) {
            fetchProofUrl();
        }
    }, [isOpen, order]);

    if (!order) return null;

    const handleConfirmPayment = async () => {
        if (!order) return;
        try {
            const { error } = await supabase
                .from('orders')
                .update({
                    status: 'processing',
                    is_paid: true
                })
                .eq('id', order.id);

            if (error) throw error;

            toast.success('Payment confirmed & Order processing');
            if (onOrderUpdated) onOrderUpdated();
            onClose();
        } catch (error: any) {
            toast.error('Failed to confirm payment');
            console.error(error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${order.id}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('payment-proofs')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('payment-proofs')
                .getPublicUrl(fileName);

            const { error: updateError } = await supabase
                .from('orders')
                .update({ payment_proof: publicUrl })
                .eq('id', order.id);

            if (updateError) throw updateError;

            toast.success('Payment proof uploaded successfully');
            onOrderUpdated();
            // We don't close the modal so the admin can see the uploaded image immediately (if we were re-fetching order prop, but order prop comes from parent. Parent refetches onOrderUpdated, but might not update the prop immediately if selectedOrder is state. 
            // Actually, OrdersManager updates the list query. selectedOrder is a detached state object. We need to update selectedOrder or close modal.
            // Let's close modal for now to force a refresh state logic in parent, or better: update the local order object to show the image?
            // Simpler: Close modal.
            onClose();
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error('Failed to upload payment proof');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) return;

        setIsDeleting(true);
        try {
            // Delete order items first (cascade usually handles this, but good to be safe if not)
            const { error: itemsError } = await supabase
                .from('order_items')
                .delete()
                .eq('order_id', order.id);

            if (itemsError) throw itemsError;

            // Delete order
            const { error: orderError } = await supabase
                .from('orders')
                .delete()
                .eq('id', order.id);

            if (orderError) throw orderError;

            toast.success('Order deleted successfully');
            onOrderUpdated();
            onClose();
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error('Failed to delete order');
        } finally {
            setIsDeleting(false);
        }
    };

    const whatsappLink = order.customer_phone
        ? `https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=Hello ${order.customer_name}, regarding your order #${order.id.slice(0, 8)}...`
        : '#';

    const emailLink = order.customer_email
        ? `mailto:${order.customer_email}?subject=Order #${order.id.slice(0, 8)} Update&body=Hello ${order.customer_name},`
        : '#';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-zinc-950 text-white border-white/10">
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                Order #{order.id.slice(0, 8)}
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${order.status === 'delivered' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                    order.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                        'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {order.status}
                                </span>
                            </DialogTitle>
                            <DialogDescription className="text-white/40 mt-1">
                                Placed on {format(new Date(order.created_at), 'PPP p')}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="col-span-2 text-sm font-semibold text-white/40 uppercase tracking-wider mb-2">Customer Details</div>

                        <div>
                            <label className="text-xs text-white/40 block">Name</label>
                            <span className="font-medium">{order.customer_name}</span>
                        </div>
                        <div>
                            <label className="text-xs text-white/40 block">Phone</label>
                            <span className="font-medium">{order.customer_phone || '-'}</span>
                        </div>
                        <div>
                            <label className="text-xs text-white/40 block">Email</label>
                            <span className="font-medium break-all">{order.customer_email}</span>
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs text-white/40 block">Location</label>
                            <span className="font-medium">
                                {order.governorate && <span>{order.governorate}, </span>}
                                {order.city && <span>{order.city}</span>}
                                {(!order.governorate && !order.city) && '-'}
                            </span>
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs text-white/40 block">Address</label>
                            <span className="font-medium">{order.address}</span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Items</div>
                        <div className="space-y-3">
                            {order.order_items?.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                                        {item.products?.image && (
                                            <img src={item.products.image} alt={item.products.name} className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{item.products?.name}</p>
                                        <p className="text-sm text-white/40">
                                            {item.variant_name && <span className="text-purple-400">{item.variant_name} • </span>}
                                            x{item.quantity}
                                        </p>
                                    </div>
                                    <div className="font-mono text-sm">
                                        EGP {item.price * item.quantity}
                                    </div>
                                </div>
                            ))}
                            <div className="pt-3 border-t border-white/10 flex justify-between font-bold">
                                <span>Total</span>
                                <span className="text-purple-400">EGP {order.total_amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Payment</div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="font-medium capitalize">{order.payment_method === 'instapay' ? 'InstaPay / E-Wallet' : order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</p>
                                <p className={`text-sm ${order.is_paid ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {order.is_paid ? 'Paid' : 'Payment Pending'}
                                </p>
                            </div>
                            {order.payment_method === 'instapay' && !order.is_paid && (
                                <Button size="sm" onClick={handleConfirmPayment} className="bg-green-600 hover:bg-green-700 text-white">
                                    Confirm Payment
                                </Button>
                            )}
                        </div>

                        {order.payment_proof ? (
                            <div className="mt-4">
                                <label className="text-xs text-white/40 block mb-2">Payment Receipt</label>
                                <a
                                    href={proofUrl || '#'} // Use proofUrl here
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block relative group overflow-hidden rounded-lg border border-white/10 aspect-video bg-black/40"
                                >
                                    <img
                                        src={proofUrl || ''} // Use proofUrl here
                                        alt="Payment Proof"
                                        className="w-full h-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="w-6 h-6 text-white" />
                                        <span className="ml-2 font-medium">View Full Image</span>
                                    </div>
                                </a>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <label className="text-xs text-white/40 block mb-2">Payment Receipt</label>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        <span>No payment receipt uploaded yet.</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            disabled={isUploading}
                                        />
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full bg-white/10 hover:bg-white/20 text-white border-0"
                                            disabled={isUploading}
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            {isUploading ? 'Uploading...' : 'Upload Receipt'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button
                            className="bg-[#25D366] hover:bg-[#20bd5a] text-white border-0"
                            onClick={() => window.open(whatsappLink, '_blank')}
                            disabled={!order.customer_phone}
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            WhatsApp
                        </Button>
                        <Button
                            variant="outline"
                            className="border-white/10 hover:bg-white/5"
                            onClick={() => window.location.href = emailLink}
                            disabled={!order.customer_email}
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                        </Button>

                        <Button
                            variant="destructive"
                            className="col-span-2 mt-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {isDeleting ? 'Deleting...' : 'Delete Order'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailsModal;
