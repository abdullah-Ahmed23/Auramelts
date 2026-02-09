import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { logActivity } from '@/lib/logger';
import { useQueryClient, useQuery } from '@tanstack/react-query';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        cost: '',
        category_id: '',
        scent: '',
        image: '',
        featured: false,
        is_best_seller: false,
        stock: ''
    });

    const [hasVariants, setHasVariants] = useState(false);
    const [variants, setVariants] = useState<{ name: string, price: string, cost: string, stock: string }[]>([]);
    const [newVariant, setNewVariant] = useState({ name: '', price: '', cost: '', stock: '' });

    const handleAddVariant = () => {
        if (!newVariant.name || !newVariant.price) {
            toast.error('Please enter variant name and price');
            return;
        }
        setVariants([...variants, newVariant]);
        setNewVariant({ name: '', price: '', cost: '', stock: '' });
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    // Fetch categories for the select
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await supabase.from('categories').select('*');
            return data || [];
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Transform variants to numbers
            const processedVariants = hasVariants ? variants.map(v => ({
                name: v.name,
                price: parseFloat(v.price),
                cost: parseFloat(v.cost || '0'),
                stock: parseInt(v.stock || '0')
            })) : null;

            // If has variants, use the first variant's price/cost as the main price for sorting/display
            const mainPrice = hasVariants && processedVariants && processedVariants.length > 0
                ? processedVariants[0].price
                : parseFloat(formData.price);

            const mainCost = hasVariants && processedVariants && processedVariants.length > 0
                ? processedVariants[0].cost
                : parseFloat(formData.cost || '0');

            if (hasVariants && (!processedVariants || processedVariants.length === 0)) {
                toast.error('Please add at least one variant');
                setLoading(false);
                return;
            }

            const { error } = await supabase.from('products').insert([{
                ...formData,
                price: mainPrice,
                cost: mainCost,
                stock: parseInt(formData.stock || '0'),
                variants: processedVariants
            }]);
            if (error) throw error;

            if (error) throw error;
            await logActivity('Product Created', `Created product: ${formData.name}`, 'create');
            toast.success('Product created successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            onClose();
            setFormData({
                name: '', description: '', price: '', cost: '', category_id: '',
                scent: '', image: '', featured: false, is_best_seller: false, stock: ''
            });
            setVariants([]);
            setHasVariants(false);
            setNewVariant({ name: '', price: '', cost: '', stock: '' });
        } catch (error: any) {
            toast.error(error.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1A1A1A] text-white border-white/10 sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                required
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (EGP)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                                required={!hasVariants}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <Label htmlFor="has-variants" className="cursor-pointer">Has Variants (e.g. Sizes)</Label>
                        <Switch
                            id="has-variants"
                            checked={hasVariants}
                            onCheckedChange={setHasVariants}
                        />
                    </div>

                    {!hasVariants ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cost">Cost (EGP) - <span className="text-white/40 text-xs">For Margin Calc</span></Label>
                                <Input
                                    id="cost"
                                    type="number"
                                    value={formData.cost}
                                    onChange={(e) => setFormData(p => ({ ...p, cost: e.target.value }))}
                                    className="bg-white/5 border-white/10 text-white"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData(p => ({ ...p, stock: e.target.value }))}
                                    className="bg-white/5 border-white/10 text-white"
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 bg-white/5 p-4 rounded-lg border border-white/10">
                            <Label>Variants</Label>
                            <div className="grid grid-cols-4 gap-2">
                                <Input
                                    placeholder="Name"
                                    value={newVariant.name}
                                    onChange={(e) => setNewVariant(p => ({ ...p, name: e.target.value }))}
                                    className="bg-white/5 border-white/10 text-white text-xs"
                                />
                                <Input
                                    placeholder="Price"
                                    type="number"
                                    value={newVariant.price}
                                    onChange={(e) => setNewVariant(p => ({ ...p, price: e.target.value }))}
                                    className="bg-white/5 border-white/10 text-white text-xs"
                                />
                                <Input
                                    placeholder="Stock"
                                    type="number"
                                    value={newVariant.stock}
                                    onChange={(e) => setNewVariant(p => ({ ...p, stock: e.target.value }))}
                                    className="bg-white/5 border-white/10 text-white text-xs"
                                />
                                <div className="flex gap-1">
                                    <Input
                                        placeholder="Cost"
                                        type="number"
                                        value={newVariant.cost}
                                        onChange={(e) => setNewVariant(p => ({ ...p, cost: e.target.value }))}
                                        className="bg-white/5 border-white/10 text-white text-xs"
                                    />
                                    <Button type="button" onClick={handleAddVariant} size="sm" className="bg-purple-600 px-2">
                                        +
                                    </Button>
                                </div>
                            </div>

                            {variants.length > 0 && (
                                <div className="space-y-2 mt-2">
                                    {variants.map((v, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm bg-black/20 p-2 rounded">
                                            <span>{v.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-white/60">{v.price} EGP (Stock: {v.stock || 0})</span>
                                                <button type="button" onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-300">×</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(val) => setFormData(p => ({ ...p, category_id: val }))}>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                {categories.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="scent">Scent Notes</Label>
                        <Input
                            id="scent"
                            value={formData.scent}
                            onChange={(e) => setFormData(p => ({ ...p, scent: e.target.value }))}
                            placeholder="e.g. Lavender & Vanilla"
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="image">Image URL</Label>
                            <a href="https://postimages.org/" target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:text-purple-300">
                                Upload image here
                            </a>
                        </div>
                        <Input
                            id="image"
                            value={formData.image}
                            onChange={(e) => setFormData(p => ({ ...p, image: e.target.value }))}
                            placeholder="https://..."
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>

                    <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="featured"
                                checked={formData.featured}
                                onCheckedChange={(checked) => setFormData(p => ({ ...p, featured: checked }))}
                            />
                            <Label htmlFor="featured">Featured</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="best_seller"
                                checked={formData.is_best_seller}
                                onCheckedChange={(checked) => setFormData(p => ({ ...p, is_best_seller: checked }))}
                            />
                            <Label htmlFor="best_seller">Best Seller</Label>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Product'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog >
    );
};

export default AddProductModal;
