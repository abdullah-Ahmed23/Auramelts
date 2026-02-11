import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Mail,
    Calendar,
    Trash2,
    Download,
    Search,
    ToggleLeft,
    ToggleRight,
    Loader2,
    Settings2,
    Percent
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface Subscriber {
    id: string;
    email: string;
    created_at: string;
}

interface NewsletterSettings {
    enabled: boolean;
    discount_percent: number;
}

const Subscribers = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [settings, setSettings] = useState<NewsletterSettings>({ enabled: true, discount_percent: 10 });
    const [updatingSettings, setUpdatingSettings] = useState(false);

    useEffect(() => {
        fetchSubscribers();
        fetchSettings();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const { data, error } = await supabase
                .from('subscribers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubscribers(data || []);
        } catch (error: any) {
            toast.error('Failed to fetch subscribers');
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('store_settings')
                .select('value')
                .eq('key', 'newsletter_popup')
                .single();

            if (error) throw error;
            if (data?.value) {
                setSettings(data.value as NewsletterSettings);
            }
        } catch (error: any) {
            console.error('Failed to fetch settings:', error);
        }
    };

    const togglePopup = async () => {
        setUpdatingSettings(true);
        const newSettings = { ...settings, enabled: !settings.enabled };
        try {
            const { error } = await supabase
                .from('store_settings')
                .upsert({
                    key: 'newsletter_popup',
                    value: newSettings
                });

            if (error) throw error;
            setSettings(newSettings);
            toast.success(`Newsletter popup ${newSettings.enabled ? 'enabled' : 'disabled'}`);
        } catch (error: any) {
            toast.error('Failed to update settings');
        } finally {
            setUpdatingSettings(false);
        }
    };

    const updateDiscount = async (percent: number) => {
        setUpdatingSettings(true);
        const newSettings = { ...settings, discount_percent: percent };
        try {
            const { error } = await supabase
                .from('store_settings')
                .upsert({
                    key: 'newsletter_popup',
                    value: newSettings
                });

            if (error) throw error;
            setSettings(newSettings);
            toast.success(`Discount updated to ${percent}%`);
        } catch (error: any) {
            toast.error('Failed to update discount');
        } finally {
            setUpdatingSettings(false);
        }
    };

    const deleteSubscriber = async (id: string) => {
        if (!confirm('Are you sure you want to remove this subscriber?')) return;

        try {
            const { error } = await supabase
                .from('subscribers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setSubscribers(subscribers.filter(s => s.id !== id));
            toast.success('Subscriber removed');
        } catch (error: any) {
            toast.error('Failed to delete subscriber');
        }
    };

    const exportCSV = () => {
        const headers = ['Email', 'Subscribed At'];
        const data = subscribers.map(s => [
            s.email,
            format(new Date(s.created_at), 'yyyy-MM-dd HH:mm:ss')
        ]);

        const csvContent = [headers, ...data].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `subscribers_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredSubscribers = subscribers.filter(s =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Subscribers</h1>
                    <p className="text-white/50">Manage your newsletter family and campaign settings.</p>
                </div>
                <Button
                    onClick={exportCSV}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </Button>
            </div>

            {/* Settings Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-purple-500/20 rounded-2xl">
                            <Settings2 className="w-6 h-6 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Popup Control</h2>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                        <div>
                            <p className="text-white font-medium">Newsletter Popup</p>
                            <p className="text-white/40 text-sm">Enable/disable for all visitors.</p>
                        </div>
                        <button
                            onClick={togglePopup}
                            disabled={updatingSettings}
                            className="transition-transform active:scale-95 disabled:opacity-50"
                        >
                            {updatingSettings ? (
                                <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
                            ) : settings.enabled ? (
                                <ToggleRight className="w-10 h-10 text-pink-500" />
                            ) : (
                                <ToggleLeft className="w-10 h-10 text-white/20" />
                            )}
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-pink-500/20 rounded-2xl">
                            <Percent className="w-6 h-6 text-pink-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Reward Settings</h2>
                    </div>

                    <div className="space-y-4">
                        <p className="text-white/60 text-sm mb-2">Discount percentage for new subscribers:</p>
                        <div className="flex gap-2">
                            {[5, 10, 15, 20].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => updateDiscount(val)}
                                    disabled={updatingSettings}
                                    className={`flex-1 py-3 rounded-xl border transition-all font-bold ${settings.discount_percent === val
                                            ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20'
                                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {val}%
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* List Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-2xl">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Subscriber List</h2>
                            <p className="text-white/40 text-sm">{filteredSubscribers.length} total subscribersFound</p>
                        </div>
                    </div>

                    <div className="relative group max-w-sm w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search emails..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-white/30 text-sm border-b border-white/10">
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Subscriber</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Subscribed Date</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-6"><div className="h-4 bg-white/10 rounded w-48"></div></td>
                                        <td className="px-6 py-6"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                                        <td className="px-6 py-6"><div className="h-8 bg-white/10 rounded w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredSubscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-white/20">
                                        No subscribers found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredSubscribers.map((subscriber) => (
                                    <tr key={subscriber.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/10">
                                                    <Mail className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <span className="text-white font-medium">{subscriber.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-white/50">
                                                <Calendar className="w-4 h-4" />
                                                {format(new Date(subscriber.created_at), 'MMM d, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button
                                                onClick={() => deleteSubscriber(subscriber.id)}
                                                className="p-3 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Subscribers;
