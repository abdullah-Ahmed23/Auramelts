import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Search,
    Trash2,
    Star,
    CheckCircle2,
    Loader2,
    ThumbsUp,
    XCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { logActivity } from '@/lib/logger';

const FeedbackManager = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const queryClient = useQueryClient();

    // Fetch Testimonials
    const { data: feedback = [], isLoading } = useQuery({
        queryKey: ['testimonials'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });

    // Approve/Reject Mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, is_approved }: { id: string, is_approved: boolean }) => {
            const { error } = await supabase
                .from('testimonials')
                .update({ is_approved })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['testimonials'] });
            logActivity('Review Status Updated', `Review ${variables.is_approved ? 'Approved' : 'Rejected'} (ID: ${variables.id.slice(0, 8)}...)`, 'update');
            toast.success(variables.is_approved ? 'Review Approved' : 'Review Hidden');
        },
        onError: () => toast.error('Failed to update status')
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('testimonials').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials'] });
            logActivity('Review Deleted', 'Admin deleted a review', 'delete');
            toast.success('Review removed');
        },
        onError: () => toast.error('Failed to remove review')
    });

    const filteredFeedback = feedback.filter((item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.feedback.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        Feedback & Testimonials
                    </h2>
                    <p className="text-white/40 mt-1">Approve testimonials to show them on the home page.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-white">
                        {feedback.length > 0
                            ? (feedback.reduce((acc: number, curr: any) => acc + curr.rating, 0) / feedback.length).toFixed(1)
                            : '0.0'
                        }
                    </span>
                    <span className="text-xs text-white/40 uppercase tracking-widest ml-1">Avg Rating</span>
                </div>
            </div>

            <div className="relative group max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search reviews or users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredFeedback.map((item: any) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`p-6 rounded-[2rem] border backdrop-blur-xl group transition-all flex flex-col h-full relative ${item.is_approved
                                ? 'bg-emerald-500/5 border-emerald-500/20'
                                : 'bg-white/5 border-white/10'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-lg font-bold text-white">
                                        {item.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white/90 line-clamp-1">{item.name}</h4>
                                        <div className="flex text-yellow-500 text-[10px] gap-0.5 mt-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={cn("w-3 h-3", i < item.rating ? "fill-current" : "text-white/10 fill-none")} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateStatusMutation.mutate({ id: item.id, is_approved: !item.is_approved })}
                                        className={cn(
                                            "p-2 rounded-lg transition-colors border",
                                            item.is_approved
                                                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                                                : "text-white/20 border-white/10 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20"
                                        )}
                                        title={item.is_approved ? "Reject (Hide)" : "Approve (Show)"}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => deleteMutation.mutate(item.id)}
                                        className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-2">
                                <span className={cn(
                                    "px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border",
                                    item.is_approved
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                )}>
                                    {item.is_approved ? 'Live' : 'Pending'}
                                </span>
                            </div>

                            <blockquote className="flex-1 text-sm text-white/70 italic leading-relaxed mb-4">
                                "{item.feedback}"
                            </blockquote>

                            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                                <span className="text-xs font-medium text-white/50">{item.location || 'Unknown Location'}</span>
                                <span className="text-[10px] text-white/20 uppercase tracking-widest">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredFeedback.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-white/20 italic">No reviews found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default FeedbackManager;
