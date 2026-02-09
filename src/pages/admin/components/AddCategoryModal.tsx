import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import { logActivity } from '@/lib/logger';
import { useQueryClient } from '@tanstack/react-query';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddCategoryModal = ({ isOpen, onClose }: AddCategoryModalProps) => {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        icon: '📦',
        image: '' // New field for image URL
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size must be less than 2MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('categories')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Upload Error Details:', uploadError);
                toast.error(`Image upload failed: ${uploadError.message}`);
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('categories')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            // Don't suppress the error, let it bubble up or handle it visibly
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.image;

            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            }

            const { error } = await supabase.from('categories').insert([{
                ...formData,
                image: imageUrl
            }]);

            if (error) throw error;

            await logActivity('Category Created', `Created category: ${formData.name}`, 'create');
            toast.success('Category created successfully');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            onClose();
            setFormData({ name: '', slug: '', description: '', icon: '📦', image: '' });
            setImageFile(null);
            setImagePreview(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1A1A1A] text-white border-white/10 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="image-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl hover:border-purple-500/50 transition-colors bg-white/5 relative overflow-hidden group">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-white/40 group-hover:text-purple-400 transition-colors">
                                        <Upload className="w-8 h-8 mb-2" />
                                        <span className="text-xs">Upload Category Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-medium">Change Image</span>
                                </div>
                            </div>
                        </Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                            required
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                            required
                            className="bg-white/5 border-white/10 text-white font-mono text-xs"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="icon">Icon (Emoji Fallback)</Label>
                        <Input
                            id="icon"
                            value={formData.icon}
                            onChange={(e) => setFormData(p => ({ ...p, icon: e.target.value }))}
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
                    <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Category'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCategoryModal;
