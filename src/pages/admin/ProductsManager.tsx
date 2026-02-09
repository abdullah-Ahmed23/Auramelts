import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit2,
    Copy,
    Trash2,
    ArrowUpDown,
    Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { logActivity } from '@/lib/logger';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';

const ProductsManager = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const queryClient = useQueryClient();

    // Fetch Products
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as any[];
        }
    });

    // Fetch Categories for Filter
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data, error } = await supabase.from('categories').select('*');
            if (error) throw error;
            return data;
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            logActivity('Product Deleted', 'Admin deleted a product', 'delete');
            toast.success('Product deleted successfully');
        },
        onError: () => toast.error('Failed to delete product')
    });

    // Duplicate Mutation
    const duplicateMutation = useMutation({
        mutationFn: async (product: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, created_at, ...productData } = product;
            const { error } = await supabase.from('products').insert({
                ...productData,
                name: `${product.name} (Copy)`
            });
            if (error) throw error;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            logActivity('Product Duplicated', `Admin duplicated product: ${variables.name}`, 'create');
            toast.success('Product duplicated successfully');
        },
        onError: () => toast.error('Failed to duplicate product')
    });

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p?.scent?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
        return matchesSearch && matchesCategory;
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
            <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
            <EditProductModal
                isOpen={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                product={editingProduct}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                        Products
                    </h2>
                    <p className="text-white/40 mt-1">Manage your catalog, stock, and pricing.</p>
                </div>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-6 py-6 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all transform hover:scale-105 active:scale-95 group"
                >
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    Add New Product
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={cn(
                            "px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all",
                            selectedCategory === 'all'
                                ? "bg-purple-500/10 border-purple-500/50 text-purple-400"
                                : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
                        )}
                    >
                        All
                    </button>
                    {categories.map((cat: any) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all",
                                selectedCategory === cat.id
                                    ? "bg-purple-500/10 border-purple-500/50 text-purple-400"
                                    : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl group/table">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-5 text-sm font-semibold text-white/60">
                                    <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group">
                                        Product
                                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                    </div>
                                </th>
                                <th className="px-6 py-5 text-sm font-semibold text-white/60">Category</th>
                                <th className="px-6 py-5 text-sm font-semibold text-white/60">Price</th>
                                <th className="px-6 py-5 text-sm font-semibold text-white/60">Stock</th>
                                <th className="px-6 py-5 text-sm font-semibold text-white/60">Cost</th>
                                <th className="px-6 py-5 text-sm font-semibold text-white/60 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            <AnimatePresence mode='popLayout'>
                                {filteredProducts.map((product) => (
                                    <motion.tr
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="hover:bg-white/[0.02] transition-colors group/row"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden bg-black/40 p-1 group-hover/row:scale-110 transition-transform">
                                                    <img src={product.image || 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=100'} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm group-hover/row:text-purple-400 transition-colors uppercase tracking-tight">{product.name}</p>
                                                    <p className="text-xs text-white/30 font-medium">{product.scent}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-white/60">
                                                {categories.find((c: any) => c.id === product.category_id)?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm">
                                            {product.variants && product.variants.length > 0 ? (
                                                <span className="text-xs">
                                                    EGP {Math.min(...product.variants.map((v: any) => v.price))} - {Math.max(...product.variants.map((v: any) => v.price))}
                                                </span>
                                            ) : (
                                                `EGP ${product.price}`
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm">
                                            <span className={cn(
                                                "px-2 py-1 rounded-md text-xs font-bold",
                                                (product.stock || 0) === 0 ? "bg-red-500/20 text-red-400" :
                                                    (product.stock || 0) < 10 ? "bg-yellow-500/20 text-yellow-400" :
                                                        "bg-green-500/20 text-green-400"
                                            )}>
                                                {product.stock || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-white/60">
                                            {product.variants && product.variants.length > 0 ? (
                                                <span className="text-xs">
                                                    EGP {Math.min(...product.variants.map((v: any) => v.cost || 0))} - {Math.max(...product.variants.map((v: any) => v.cost || 0))}
                                                </span>
                                            ) : (
                                                product.cost ? `EGP ${product.cost}` : '-'
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingProduct(product)}
                                                    className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => duplicateMutation.mutate(product)}
                                                    className="p-2 text-white/30 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all"
                                                    title="Duplicate"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteMutation.mutate(product.id)}
                                                    className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductsManager;
