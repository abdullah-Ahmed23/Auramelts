import React, { useState } from 'react';
import {
    Filter,
    FileSpreadsheet,
    Search,
    CheckCircle2,
    AlertCircle,
    Upload,
    Eye,
    MoreVertical,
    Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import xlsx from 'json-as-xlsx';
import { supabase } from '@/lib/supabase';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

import OrderDetailsModal from './components/OrderDetailsModal';

const OrdersManager = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items:order_items(*, products:products(name, image))')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            const { error } = await supabase.from('orders').update({ status }).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Order status updated');
        },
        onError: () => toast.error('Failed to update status')
    });

    const exportToExcel = () => {
        if (orders.length === 0) {
            toast.error('No orders to export');
            return;
        }

        const data = [
            {
                sheet: "Orders Report",
                columns: [
                    { label: "Order ID", value: "id" },
                    { label: "Customer", value: "customer_name" },
                    { label: "Email", value: "customer_email" },
                    { label: "Amount (EGP)", value: "total_amount" },
                    { label: "Payment Method", value: "payment_method" },
                    { label: "Status", value: "status" },
                    { label: "Paid", value: (row: any) => row.is_paid ? "Yes" : "No" },
                    { label: "Date", value: (row: any) => new Date(row.created_at).toLocaleDateString() },
                ],
                content: orders,
            },
        ];

        const settings = {
            fileName: `Aura_Melts_Orders_${new Date().toISOString().split('T')[0]}`,
        };

        xlsx(data, settings);
        toast.success('Excel report generated successfully!');
    };

    const filteredOrders = orders.filter((o: any) =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statusColors: Record<string, string> = {
        pending: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    const paymentLabels: Record<string, string> = {
        cod: 'Cash on Delivery',
        instapay: 'InstaPay / E-Wallet',
        vodafone_cash: 'Vodafone Cash',
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                        Orders
                    </h2>
                    <p className="text-white/40 mt-1">Track sales, verify payments, and manage shipping.</p>
                </div>
                <Button
                    onClick={exportToExcel}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 py-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all group"
                >
                    <FileSpreadsheet className="w-5 h-5 mr-2" />
                    Export Daily Report
                </Button>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="rounded-xl border border-white/5 text-white/50 hover:text-white">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="px-6 py-5 text-sm font-semibold text-white/60 uppercase tracking-wider">Order Info</th>
                                <th className="px-6 py-5 text-sm font-semibold text-white/60 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-5 text-sm font-semibold text-white/60 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-5 text-sm font-semibold text-white/60 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {filteredOrders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-purple-400 tracking-wider truncate max-w-[150px]">#{order.id}</span>
                                            <span className="font-medium text-sm text-white/80">{order.customer_name}</span>
                                            <span className="text-[10px] text-white/30 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-white/60">{paymentLabels[order.payment_method] || order.payment_method}</span>
                                                {order.is_paid ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                ) : (
                                                    <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm">EGP {order.total_amount}</span>
                                                {order.payment_proof_url && (
                                                    <a href={order.payment_proof_url} target="_blank" rel="noreferrer" className="text-white/30 hover:text-purple-400 transition-colors">
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
                                            className={cn(
                                                "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-transparent border focus:outline-none cursor-pointer hover:bg-white/5 transition-all w-32",
                                                statusColors[order.status] || statusColors['pending']
                                            )}
                                        >
                                            <option value="pending" className="bg-[#0A0A0B]">Pending</option>
                                            <option value="processing" className="bg-[#0A0A0B]">Processing</option>
                                            <option value="shipped" className="bg-[#0A0A0B]">Shipped</option>
                                            <option value="delivered" className="bg-[#0A0A0B]">Delivered</option>
                                            <option value="cancelled" className="bg-[#0A0A0B]">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/40 hover:text-white"
                                                onClick={() => setSelectedOrder(order)}
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-white/20 italic">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <OrderDetailsModal
                order={selectedOrder}
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onOrderUpdated={() => queryClient.invalidateQueries({ queryKey: ['orders'] })}
            />
        </div>
    );
};

export default OrdersManager;
