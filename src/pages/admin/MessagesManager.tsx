import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Search,
    Trash2,
    Mail,
    User,
    Clock,
    CheckCircle2,
    Archive,
    Loader2,
    Inbox,
    Phone
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { logActivity } from '@/lib/logger';

const MessagesManager = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const queryClient = useQueryClient();

    // Fetch Messages
    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['messages'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });

    // Mark as Read Mutation
    const markAsReadMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('messages').update({ status: 'read' }).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            toast.success('Message marked as read');
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('messages').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            logActivity('Message Deleted', 'Admin deleted a message', 'delete');
            toast.success('Message deleted');
        },
        onError: () => toast.error('Failed to delete message')
    });

    const filteredMessages = messages.filter((msg: any) => {
        const matchesSearch =
            msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (msg.phone && msg.phone.includes(searchQuery));

        const matchesFilter = filter === 'all' || msg.status === filter;

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
                        Messages
                    </h2>
                    <p className="text-white/40 mt-1">Customer inquiries and support requests.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
                    {(['all', 'unread', 'read'] as const).map((f) => (
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
                    placeholder="Search subject, name, email or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                />
            </div>

            <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                    {filteredMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-white/20">
                            <Inbox className="w-16 h-16 mb-4 opacity-20" />
                            <p>No messages found</p>
                        </div>
                    ) : (
                        filteredMessages.map((msg: any) => (
                            <motion.div
                                key={msg.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "p-6 rounded-2xl border backdrop-blur-xl group relative overflow-hidden",
                                    msg.status === 'unread'
                                        ? "bg-purple-500/[0.03] border-purple-500/20 shadow-[0_0_20px_-10px_rgba(168,85,247,0.1)]"
                                        : "bg-white/5 border-white/5 hover:border-white/10"
                                )}
                            >
                                {/* Status Indicator */}
                                {msg.status === 'unread' && (
                                    <div className="absolute top-6 right-6 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">New</span>
                                    </div>
                                )}

                                <div className="flex items-start gap-4 mb-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border",
                                        msg.status === 'unread'
                                            ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                                            : "bg-white/5 border-white/10 text-white/30"
                                    )}>
                                        {msg.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={cn("font-semibold text-lg", msg.status === 'unread' ? "text-white" : "text-white/70")}>{msg.subject}</h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/40 mt-1">
                                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {msg.name}</span>
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {msg.email}</span>
                                            {msg.phone && (
                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {msg.phone}</span>
                                            )}
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(msg.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pl-14">
                                    <p className="text-white/80 leading-relaxed text-sm bg-black/20 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                                        {msg.message}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3 mt-4">
                                        {msg.status === 'unread' && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => markAsReadMutation.mutate(msg.id)}
                                                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Mark as Read
                                            </Button>
                                        )}

                                        <a
                                            href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                            className="inline-flex items-center justify-center h-8 rounded-md px-3 text-xs font-medium  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white hover:bg-white/5 border border-white/10"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <Mail className="w-4 h-4 mr-2" />
                                            Email
                                        </a>

                                        {msg.phone && (
                                            <a
                                                href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                                                className="inline-flex items-center justify-center h-8 rounded-md px-3 text-xs font-medium  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-green-400 hover:bg-green-400/10 border border-green-400/20"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                WhatsApp
                                            </a>
                                        )}

                                        <div className="flex-1" />
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => deleteMutation.mutate(msg.id)}
                                            className="text-white/20 hover:text-red-400 hover:bg-red-400/10 ml-auto"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MessagesManager;
