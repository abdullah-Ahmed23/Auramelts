
import { useState, useEffect } from 'react';
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

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

const EditProductModal = ({ isOpen, onClose, product }: EditProductModalProps) => {
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

    useEffect(() => {
        if (product) {
            const productVariants = product.variants || [];
            const hasProductVariants = productVariants.length > 0;

            setHasVariants(hasProductVariants);
            setVariants(hasProductVariants ? productVariants.map((v: any) => ({
                name: v.name,
                price: v.price?.toString(),
                cost: v.cost?.toString(),
                stock: v.stock?.toString()
            })) : []);

            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                cost: product.cost?.toString() || '',
                category_id: product.category_id || '',
                scent: product.scent || '',
                image: product.image || '',
                featured: product.featured || false,
                is_best_seller: product.is_best_seller || false,
                stock: product.stock?.toString() || '0'
            });
        }
    }, [product, isOpen]);

    // Fetch categories for the select
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await supabase.from('categories').select('*');
            return data || [];
        }
    });

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

            // If has variants, use the first variant's price as the main price for sorting/display
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

            const { error } = await supabase
                .from('products')
                .update({
                    ...formData,
                    price: mainPrice,
                    cost: mainCost,
                    stock: parseInt(formData.stock || '0'),
                    variants: processedVariants
                })
                .eq('id', product.id);

            if (error) throw error;

            await logActivity('Product Updated', `Updated product: ${formData.name}`, 'update');
            toast.success('Product updated successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1A1A1A] text-white border-white/10 sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                required
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-stock">Stock Quantity</Label>
                            <Input
                                id="edit-stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData(p => ({ ...p, stock: e.target.value }))}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <Label htmlFor="edit-has-variants" className="cursor-pointer">Has Variants (e.g. Sizes)</Label>
                        <Switch
                            id="edit-has-variants"
                            checked={hasVariants}
                            onCheckedChange={setHasVariants}
                        />
                    </div>

                    {!hasVariants ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Price (EGP)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                                    required={!hasVariants}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-cost">Cost (EGP)</Label>
                                <Input
                                    id="edit-cost"
                                    type="number"
                                    value={formData.cost}
                                    onChange={(e) => setFormData(p => ({ ...p, cost: e.target.value }))}
                                    className="bg-white/5 border-white/10 text-white"
                                    placeholder="0.00"
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
                        <Label htmlFor="edit-category">Category</Label>
                        <Select
                            value={formData.category_id}
                            onValueChange={(val) => setFormData(p => ({ ...p, category_id: val }))}
                        >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                {categories.map((cat: any) => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-scent">Scent Profile</Label>
                        <Input
                            id="edit-scent"
                            value={formData.scent}
                            onChange={(e) => setFormData(p => ({ ...p, scent: e.target.value }))}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="e.g. Vanilla, Lavender, Citrus"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-image">Image URL</Label>
                        <Input
                            id="edit-image"
                            value={formData.image}
                            onChange={(e) => setFormData(p => ({ ...p, image: e.target.value }))}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                            className="bg-white/5 border-white/10 text-white min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <Label htmlFor="edit-featured" className="cursor-pointer">Featured Product</Label>
                            <Switch
                                id="edit-featured"
                                checked={formData.featured}
                                onCheckedChange={(checked) => setFormData(p => ({ ...p, featured: checked }))}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <Label htmlFor="edit-bestseller" className="cursor-pointer">Best Seller</Label>
                            <Switch
                                id="edit-bestseller"
                                checked={formData.is_best_seller}
                                onCheckedChange={(checked) => setFormData(p => ({ ...p, is_best_seller: checked }))}
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Product'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductModal;
