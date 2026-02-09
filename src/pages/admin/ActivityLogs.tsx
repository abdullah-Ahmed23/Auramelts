import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Search,
    Clock,
    User,
    Loader2,
    Filter
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const ActivityLogs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'create' | 'update' | 'delete'>('all');

    const { data: logs = [], isLoading } = useQuery({
        queryKey: ['activity_logs_full'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('activity_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;
            return data;
        },
        refetchInterval: 5000
    });

    const filteredLogs = logs.filter((log: any) => {
        const matchesSearch =
            log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.details?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filter === 'all' || log.action_type === filter;

        return matchesSearch && matchesFilter;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                        Activity Logs
                    </h2>
                    <p className="text-white/40 mt-1">Track actions and events across the system.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
                    {(['all', 'create', 'update', 'delete'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all",
                                filter === f
                                    ? "bg-purple-500/20 text-purple-400 shadow-sm"
                                    : "text-white/40 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                />
            </div>

            <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                    {filteredLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-white/20">
                            <Activity className="w-16 h-16 mb-4 opacity-20" />
                            <p>No activities found</p>
                        </div>
                    ) : (
                        filteredLogs.map((log: any) => (
                            <motion.div
                                key={log.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-start gap-4"
                            >
                                <div className={cn(
                                    "mt-1 w-2 h-2 rounded-full flex-shrink-0",
                                    log.action_type === 'create' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" :
                                        log.action_type === 'update' ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" :
                                            log.action_type === 'delete' ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-purple-500"
                                )} />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <h3 className="font-semibold text-white/90 truncate">{log.action}</h3>
                                        <span className="text-xs text-white/30 whitespace-nowrap font-mono flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(log.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed font-light">
                                        {log.details || 'No details provided'}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ActivityLogs;
