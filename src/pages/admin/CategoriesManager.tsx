import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tags,
    Plus,
    Edit2,
    Trash2,
    Layers,
    Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { logActivity } from '@/lib/logger';

// ... imports
import AddCategoryModal from './components/AddCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';

const CategoriesManager = () => {
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data, error } = await supabase.from('categories').select('*').order('created_at');
            if (error) throw error;
            return data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            logActivity('Category Deleted', 'Admin deleted a category', 'delete');
            toast.success('Category removed');
        },
        onError: () => toast.error('Failed to remove category')
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <AddCategoryModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
            <EditCategoryModal
                isOpen={!!editingCategory}
                onClose={() => setEditingCategory(null)}
                category={editingCategory}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                        Categories
                    </h2>
                    <p className="text-white/40 mt-1">Organize your products into collections.</p>
                </div>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-6 py-6 transition-all group"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Category
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {categories.map((cat: any, index: number) => (
                        <motion.div
                            key={cat.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-purple-500/30 transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-3xl rounded-full -mr-12 -mt-12 transition-all group-hover:bg-purple-500/10" />

                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform overflow-hidden relative">
                                    {cat.image ? (
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">{cat.icon || '📦'}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setEditingCategory(cat)}
                                        className="p-2 text-white/20 hover:text-white rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteMutation.mutate(cat.id)}
                                        className="p-2 text-white/20 hover:text-red-400 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                                <p className="text-xs text-white/40 leading-relaxed mb-4">{cat.description || 'No description'}</p>
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-purple-400">
                                    <Layers className="w-3 h-3" />
                                    <span className="truncate max-w-[150px]">{cat.slug}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CategoriesManager;
