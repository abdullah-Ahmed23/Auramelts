import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    Users,
    Activity,
    ArrowUpRight,
    Clock,
    ExternalLink,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {

    const [dateRange, setDateRange] = useState("30d");

    const [statsData, setStatsData] = useState({
        grossMargin: 0,
        totalOrders: 0,
        liveUsers: 0,
        activeProducts: 0
    });

    const [revenueData, setRevenueData] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // ... (existing stats fetching) ...
                // 1. Total Orders
                const { count: ordersCount } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true });

                // 2. Active Products
                const { count: productsCount } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true });

                // 3. Total Customers (Users)
                const { count: usersCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'customer');

                // 4. Calculate Gross Margin (Revenue - Cost) & Chart Data
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const { data: deliveredOrders } = await supabase
                    .from('orders')
                    .select('id, total_amount, created_at')
                    .eq('status', 'delivered') // Or remove this to show all orders
                    .gte('created_at', thirtyDaysAgo.toISOString());

                const totalRevenue = deliveredOrders?.reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0;

                // Process Chart Data
                const chartMap = new Map();
                // Initialize last 30 days with 0
                for (let i = 0; i < 30; i++) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split('T')[0];
                    chartMap.set(dateStr, 0);
                }

                deliveredOrders?.forEach(order => {
                    const dateStr = new Date(order.created_at).toISOString().split('T')[0];
                    if (chartMap.has(dateStr)) {
                        chartMap.set(dateStr, chartMap.get(dateStr) + (order.total_amount || 0));
                    }
                });

                const processedChartData = Array.from(chartMap.entries())
                    .map(([date, revenue]) => ({ date, revenue }))
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                setRevenueData(processedChartData);


                // Fetch all order items for delivered orders (for margin calc - simplified for now to just rely on totalRevenue if needed, or keep existing logic)
                const { data: orderItems } = await supabase
                    .from('order_items')
                    .select('quantity, product_id, products(cost)')
                    .in('order_id', deliveredOrders?.map(o => o.id) || []);

                // Calculate total cost of goods sold
                const totalCost = orderItems?.reduce((acc, item: any) => {
                    const cost = item.products?.cost || 0;
                    return acc + (cost * item.quantity);
                }, 0) || 0;

                const grossMargin = totalRevenue - totalCost;

                setStatsData({
                    grossMargin: grossMargin,
                    totalOrders: ordersCount || 0,
                    liveUsers: usersCount || 0,
                    activeProducts: productsCount || 0
                });

            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        fetchStats();

        // Realtime subscription
        const channel = supabase
            .channel('dashboard-stats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchStats)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchStats)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const stats = [
        {
            label: 'Gross Margin',
            value: `EGP ${statsData.grossMargin.toLocaleString()}`,
            change: '+12.5%',
            isUp: true,
            icon: DollarSign,
            color: 'from-emerald-500 to-teal-500'
        },
        {
            label: 'Total Orders',
            value: statsData.totalOrders.toString(),
            change: '+8.2%',
            isUp: true,
            icon: ShoppingBag,
            color: 'from-blue-500 to-indigo-500'
        },

        {
            label: 'Active Products',
            value: statsData.activeProducts.toString(),
            change: '---',
            isUp: false,
            icon: TrendingUp,
            color: 'from-orange-500 to-red-500'
        },
    ];

    const [activityLogs, setActivityLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            let query = supabase
                .from('activity_logs')
                .select('*')
                .order('created_at', { ascending: false });

            // Apply Date Filter
            if (dateRange !== 'all') {
                const now = new Date();
                let startDate = new Date();
                switch (dateRange) {
                    case "24h": startDate.setHours(startDate.getHours() - 24); break;
                    case "7d": startDate.setDate(startDate.getDate() - 7); break;
                    case "30d": startDate.setDate(startDate.getDate() - 30); break;
                    case "90d": startDate.setDate(startDate.getDate() - 90); break;
                    default: startDate.setDate(startDate.getDate() - 30);
                }
                query = query.gte('created_at', startDate.toISOString());
            } else {
                query = query.limit(50); // Limit 'all' to recent 50 to avoid overload
            }

            const { data } = await query;

            if (data) {
                const formattedLogs = data.map(log => ({
                    ...log,
                    time: new Date(log.created_at).toLocaleString(), // Simple formatting
                    user: log.user_name || log.user_email || log.user_id || 'System' // Prefer name, then email
                }));
                setActivityLogs(formattedLogs);
            } else {
                setActivityLogs([]);
            }
        };

        fetchLogs();
    }, [dateRange]); // Refetch when dateRange changes

    const clearLogs = async () => {
        if (!confirm('Are you sure you want to clear all activity logs? This cannot be undone.')) return;

        const { error } = await supabase
            .from('activity_logs')
            .delete()
            .neq('id', 0); // Hack to delete all rows if no other condition is strictly needed, or just delete all 
        // Better: .delete().gt('id', -1) or strictly .delete().all() isn't standard in client unless RLS allows. 
        // standard supabase-js delete requires a filter. 
        // Let's use a filter that matches everything usually like id > 0 if id is int, or created_at < future.

        // Actually, supabase require a filter for delete.
        // I will use .gte('id', 0) assuming id is numeric, or .neq('action', 'impossible_string').
        // Since I don't know the ID type for sure (likely int or uuid), checking schema would be good 
        // but .neq('action', '') might be safe enough to clear all distinct actions. 

        // Let's try deleting where created_at is less than now (basically everything)
        // .lt('created_at', new Date().toISOString())

        const { error: deleteError } = await supabase
            .from('activity_logs')
            .delete()
            .lt('created_at', new Date().toISOString());

        if (deleteError) {
            console.error('Error clearing logs:', deleteError);
            alert('Failed to clear logs');
        } else {
            setActivityLogs([]);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                        Aura Overview
                    </h2>
                    <p className="text-white/40 mt-1">Monitor your shop performace and real-time activity.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10 text-white backdrop-blur-xl">
                            <SelectItem value="24h">Last 24 Hours</SelectItem>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last 3 Month</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.08] transition-all relative overflow-hidden"
                    >
                        <div className={cn(
                            "absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-12 -mt-12 opacity-20 transition-opacity group-hover:opacity-30",
                            stat.color === 'from-emerald-500 to-teal-500' ? "bg-emerald-500" :
                                stat.color === 'from-blue-500 to-indigo-500' ? "bg-blue-500" :
                                    stat.color === 'from-purple-500 to-pink-500' ? "bg-purple-500" : "bg-red-500"
                        )} />

                        <div className="flex items-start justify-between relative z-10">
                            <div className={cn("p-3 rounded-2xl bg-gradient-to-tr shadow-lg", stat.color)}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            {stat.change && (
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                                    stat.isUp ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
                                )}>
                                    {stat.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {stat.change}
                                </div>
                            )}
                            {(stat as any).isLive && (
                                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium animate-pulse">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                    Live
                                </div>
                            )}
                        </div>

                        <div className="mt-4 relative z-10">
                            <p className="text-white/40 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Log */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-purple-400" />
                            <h3 className="font-bold text-lg">Activity Log</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={clearLogs}
                                className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                                title="Clear All Logs"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            {/* Removed Link button or kept if it was "View All" - The original had ArrowUpRight which usually linked to a separate page, but user asked for enhancements here. I'll keep the view logic inline for now or remove the link if it doesn't go anywhere useful yet. The original just logged. */}
                            <Link to="/admin/settings" className="text-purple-400 hover:text-purple-300 transition-colors">
                                <ArrowUpRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {activityLogs.map((log) => (
                            <div key={log.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[1px] before:bg-white/10 last:before:hidden">
                                <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-purple-500/50 ring-4 ring-purple-500/10" />
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-semibold">{log.action}</span>
                                        <span className="text-[10px] text-white/30 font-medium uppercase tracking-wider">{log.time}</span>
                                    </div>
                                    <p className="text-xs text-white/50 leading-relaxed">{log.details}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center">
                                            <Users className="w-2.5 h-2.5 text-white/40" />
                                        </div>
                                        <span className="text-[10px] text-white/40 font-medium">by {log.user}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-medium transition-all text-white/60 hover:text-white">
                        View All Activity
                    </button>
                </motion.div>

                {/* Quick Actions & Recent Orders Example */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 space-y-8"
                >
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/admin/products" className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 hover:border-purple-500/50 transition-all text-left flex items-center justify-between group">
                            <div>
                                <h4 className="font-semibold mb-1">Add New Product</h4>
                                <p className="text-xs text-white/40">Launch a new scent or item</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ArrowUpRight className="w-5 h-5 text-purple-400" />
                            </div>
                        </Link>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all text-left flex items-center justify-between group text-white/60 hover:text-white"
                        >
                            <div>
                                <h4 className="font-semibold mb-1">View Storefront</h4>
                                <p className="text-xs text-white/40">Check live changes</p>
                            </div>
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    </div>

                    {/* Placeholder for Revenue Chart */}
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl h-[340px] relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Revenue Analytics</h3>
                                    <p className="text-xs text-white/40">Last 30 Days</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[240px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        stroke="rgba(255,255,255,0.1)"
                                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return `${date.getDate()}/${date.getMonth() + 1}`;
                                        }}
                                        interval={4}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(23, 23, 23, 0.9)',
                                            borderColor: 'rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                        labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                                        formatter={(value: any) => [`EGP ${value.toLocaleString()}`, 'Revenue']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#A855F7"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
