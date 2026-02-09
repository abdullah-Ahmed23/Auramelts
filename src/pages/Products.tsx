import React, { useState, useEffect, useMemo, useDeferredValue, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, Sparkles, ChevronDown, SlidersHorizontal, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
// Import shared type
import { Product, ProductCategory } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import QuickAddModal from '@/components/products/QuickAddModal';
import PageTransition from '@/components/PageTransition';
import { Slider as MUISlider, Box, Typography } from '@mui/material';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

type SortOption = 'default' | 'price-low' | 'price-high' | 'newest';

// IMPORTANT: This component MUST be defined outside of Products to prevent
// recreation on every render, which breaks MUI Slider's drag functionality.
interface FilterSidebarProps {
  min: number;
  max: number;
  currentValue: number[];
  onPriceChange: (values: { min: number; max: number }) => void;
  activeCategory: string | null;
  setCategory: (cat: string | null) => void;
  categories: any[];
  activeAvailability?: { inStock: boolean; outOfStock: boolean };
  onAvailabilityChange?: (val: { inStock: boolean; outOfStock: boolean }) => void;
}

const FilterSidebarContent = React.memo(({
  min,
  max,
  currentValue,
  onPriceChange,
  activeCategory,
  setCategory,
  categories,
  activeAvailability,
  onAvailabilityChange
}: FilterSidebarProps) => {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    const vals = newValue as number[];
    onPriceChange({ min: vals[0], max: vals[1] });
  };

  return (
    <div className="space-y-6">
      {/* Price Filter */}
      <div className="bg-white rounded-xl border border-[#7B4B94]/10 overflow-hidden shadow-sm">
        <div className="bg-[#7B4B94] px-4 py-3 flex items-center justify-between">
          <span className="text-white font-bold text-sm tracking-wider uppercase">Price Range</span>
          <Sparkles className="w-4 h-4 text-white/40" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-[#7B4B94]/40 font-bold ml-1">Min Price</label>
              <div className="relative">
                <input
                  type="number"
                  value={currentValue[0]}
                  onChange={(e) => onPriceChange({ min: Number(e.target.value), max: currentValue[1] })}
                  className="w-full bg-[#FDF8F4] border-none rounded-lg px-3 py-2 text-sm font-bold text-[#7B4B94] focus:ring-2 focus:ring-[#E84A8A]/20 transition-all outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#7B4B94]/30 pointer-events-none">EGP</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-[#7B4B94]/40 font-bold ml-1">Max Price</label>
              <div className="relative">
                <input
                  type="number"
                  value={currentValue[1]}
                  onChange={(e) => onPriceChange({ min: currentValue[0], max: Number(e.target.value) })}
                  className="w-full bg-[#FDF8F4] border-none rounded-lg px-3 py-2 text-sm font-bold text-[#7B4B94] focus:ring-2 focus:ring-[#E84A8A]/20 transition-all outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#7B4B94]/30 pointer-events-none">EGP</span>
              </div>
            </div>
          </div>

          <Box sx={{ px: 1 }}>
            <MUISlider
              value={currentValue}
              onChange={handleChange}
              valueLabelDisplay="auto"
              min={min}
              max={max}
              disableSwap
              sx={{
                color: '#E84A8A',
                height: 6,
                padding: '13px 0',
                '& .MuiSlider-track': {
                  border: 'none',
                  background: 'linear-gradient(90deg, #E84A8A 0%, #FF85A1 100%)',
                },
                '& .MuiSlider-thumb': {
                  height: 24,
                  width: 24,
                  backgroundColor: '#fff',
                  border: '2px solid #E84A8A',
                  boxShadow: '0 4px 8px rgba(232, 74, 138, 0.2)',
                  '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(232, 74, 138, 0.1)',
                  },
                  '&:before': {
                    display: 'none',
                  },
                  '&:after': {
                    content: '""',
                    width: 6,
                    height: 6,
                    backgroundColor: '#E84A8A',
                    borderRadius: '50%',
                  }
                },
                '& .MuiSlider-valueLabel': {
                  lineHeight: 1.2,
                  fontSize: 12,
                  background: 'unset',
                  padding: 0,
                  width: 42,
                  height: 42,
                  borderRadius: '50% 50% 50% 0',
                  backgroundColor: '#7B4B94',
                  transformOrigin: 'bottom left',
                  transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
                  '&:before': { display: 'none' },
                  '&.MuiSlider-valueLabelOpen': {
                    transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
                  },
                  '& > *': {
                    transform: 'rotate(45deg)',
                  },
                },
                '& .MuiSlider-rail': {
                  opacity: 0.15,
                  backgroundColor: '#7B4B94',
                },
              }}
            />
          </Box>
        </div>
      </div>


      {/* Categories */}
      <div className="bg-white rounded-xl border border-[#7B4B94]/10 overflow-hidden">
        <Accordion type="single" collapsible defaultValue="categories" className="w-full">
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="bg-[#7B4B94] px-4 py-3 hover:no-underline [&[data-state=open]>svg]:text-white [&>svg]:text-white">
              <span className="text-white font-bold text-sm tracking-wider uppercase">Categories</span>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <div className="flex flex-col">
                <button
                  onClick={() => setCategory(null)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-[#FDF8F4] transition-colors border-b border-[#FDF8F4]"
                >
                  <Checkbox
                    checked={!activeCategory}
                    className="border-[#E84A8A] data-[state=checked]:bg-[#E84A8A] data-[state=checked]:border-[#E84A8A]"
                  />
                  <span className={`text-sm font-bold ${!activeCategory ? 'text-[#E84A8A]' : 'text-[#7B4B94]/70'}`}>All Products</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.slug)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[#FDF8F4] transition-colors border-b border-[#FDF8F4] last:border-0 group"
                  >
                    <Checkbox
                      checked={activeCategory === cat.slug}
                      className="border-[#E84A8A] data-[state=checked]:bg-[#E84A8A] data-[state=checked]:border-[#E84A8A]"
                    />

                    <div className="w-8 h-8 rounded-md bg-[#7B4B94]/5 flex items-center justify-center overflow-hidden shrink-0">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      ) : (
                        <span className="text-base">{cat.icon || '✨'}</span>
                      )}
                    </div>

                    <span className={`text-sm font-bold ${activeCategory === cat.slug ? 'text-[#E84A8A]' : 'text-[#7B4B94]/70'}`}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-xl border border-[#7B4B94]/10 overflow-hidden">
        <Accordion type="single" collapsible defaultValue="availability" className="w-full">
          <AccordionItem value="availability" className="border-none">
            <AccordionTrigger className="bg-[#7B4B94] px-4 py-3 hover:no-underline [&[data-state=open]>svg]:text-white [&>svg]:text-white">
              <span className="text-white font-bold text-sm tracking-wider uppercase">Availability</span>
            </AccordionTrigger>
            <AccordionContent className="p-5">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="instock"
                    checked={activeAvailability?.inStock}
                    onCheckedChange={(checked) => onAvailabilityChange?.({ ...activeAvailability!, inStock: checked as boolean })}
                    className="border-[#E84A8A] data-[state=checked]:bg-[#E84A8A] data-[state=checked]:border-[#E84A8A]"
                  />
                  <label htmlFor="instock" className="text-sm font-bold text-[#7B4B94]/70 cursor-pointer select-none">In Stock</label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="outstock"
                    checked={activeAvailability?.outOfStock}
                    onCheckedChange={(checked) => onAvailabilityChange?.({ ...activeAvailability!, outOfStock: checked as boolean })}
                    className="border-[#E84A8A] data-[state=checked]:bg-[#E84A8A] data-[state=checked]:border-[#E84A8A]"
                  />
                  <label htmlFor="outstock" className="text-sm font-bold text-[#7B4B94]/70 cursor-pointer select-none">Out of Stock</label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

    </div>
  );
});

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [availability, setAvailability] = useState<{ inStock: boolean; outOfStock: boolean }>({
    inStock: false,
    outOfStock: false
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return data;
    }
  });

  // Fetch Products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, image, scent, created_at, featured, is_best_seller, stock, variants, categories(slug, name)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Products.tsx - Raw data from Supabase:', data);
      console.log('Products.tsx - First product variants:', data[0]?.variants);

      // Map DB structure to Product interface for UI compatibility
      const mapped = data.map((item: any) => {
        const product = {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image || 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=500',
          category: (item.categories?.slug as ProductCategory) || 'candles',
          scent: item.scent,
          newArrival: new Date(item.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
          featured: item.featured || false,
          bestSeller: item.is_best_seller || false,
          variants: item.variants || [],
          stock: item.stock || 0
        };
        console.log(`Products.tsx - Mapped product "${product.name}":`, product);
        console.log(`Products.tsx - "${product.name}" variants:`, product.variants);
        return product;
      }) as Product[];

      return mapped;
    }
  });


  // High Performance Optimization:
  // Decouple the "urgent" slider movement from the "non-urgent" grid filtering.
  const deferredPriceRange = useDeferredValue(priceRange);

  const PRICE_GAP = 10;

  const handlePriceSliderChange = useCallback((values: { min: number; max: number }) => {
    setPriceRange([values.min, values.max]);
  }, []);



  const searchQuery = searchParams.get('search');

  // Filter Logic - uses Deferred Value to prevent blocking the slider
  // Also maps the filtering to the new dynamic data
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory ? p.category === activeCategory : true;
      const matchesSearch = searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.scent?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesPrice = p.price >= deferredPriceRange[0] && p.price <= deferredPriceRange[1];

      // Stock Filter
      let matchesStock = true;
      if (availability.inStock && !availability.outOfStock) {
        matchesStock = (p.stock || 0) > 0;
      } else if (!availability.inStock && availability.outOfStock) {
        matchesStock = (p.stock || 0) === 0;
      }
      // If both or neither are checked, show all (or could show all if both checked, often logic varies)
      // Here: if both checked, show all. If neither checked, show all.

      return matchesCategory && matchesSearch && matchesPrice && matchesStock;
    });
  }, [products, activeCategory, searchQuery, deferredPriceRange, availability]);

  // Sort Logic
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'newest': return a.newArrival ? -1 : 1;
        case 'default':
        default:
          // Featured First, then Created At (newest first which is default DB order)
          if (a.featured === b.featured) return 0;
          return a.featured ? -1 : 1;
      }
    });
  }, [filtered, sortBy]);

  const setCategory = useCallback((catSlug: string | null) => {
    if (catSlug) {
      setSearchParams({ category: catSlug });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('category');
      setSearchParams(newParams);
    }
  }, [searchParams, setSearchParams]);

  const handleQuickAdd = useCallback((product: Product) => {
    console.log('Products.tsx - handleQuickAdd called with product:', product);
    console.log('Products.tsx - handleQuickAdd product.variants:', product.variants);
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  return (
    <PageTransition>
      <Layout>
        <section className="min-h-screen bg-[#FDF8F4]">

          {/* Header */}
          <div className="bg-white border-b border-[#E84A8A]/10 pt-32 pb-8 md:pt-40 md:pb-12">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#7B4B94] mb-2">
                    Shop Collection
                  </h1>
                  <p className="text-[#7B4B94]/60">
                    Showing {sorted.length} {sorted.length === 1 ? 'result' : 'results'}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Trigger */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <button className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#7B4B94] text-white rounded-lg font-bold text-sm">
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                      </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                      <SheetHeader className="mb-6">
                        <SheetTitle className="text-left text-[#7B4B94] font-bold text-xl">Filters</SheetTitle>
                        <SheetDescription className="text-left">Refine your search</SheetDescription>
                      </SheetHeader>
                      <FilterSidebarContent
                        min={0}
                        max={100000}
                        currentValue={priceRange}
                        onPriceChange={handlePriceSliderChange}
                        activeCategory={activeCategory}
                        setCategory={setCategory}
                        categories={categories}
                        activeAvailability={availability}
                        onAvailabilityChange={setAvailability}
                      />
                    </SheetContent>
                  </Sheet>

                  <div className="w-full md:w-auto">
                    <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                      <SelectTrigger className="w-[180px] bg-white border-[#E84A8A]/20 text-[#7B4B94] font-bold focus:ring-[#E84A8A]">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Sort: Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 max-w-7xl py-12">
            <div className="grid md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] gap-8">

              {/* Desktop Sidebar */}
              <aside className="hidden md:block h-fit sticky top-24">
                <FilterSidebarContent
                  min={0}
                  max={100000}
                  currentValue={priceRange}
                  onPriceChange={handlePriceSliderChange}
                  activeCategory={activeCategory}
                  setCategory={setCategory}
                  categories={categories}
                  activeAvailability={availability}
                  onAvailabilityChange={setAvailability}
                />
              </aside>

              {/* Product Grid */}
              <div>
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 text-[#E84A8A] animate-spin" />
                    </div>
                  ) : sorted.length > 0 ? (
                    <motion.div
                      className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                    >
                      {sorted.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          index={index}
                          onQuickAdd={handleQuickAdd}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-[#E84A8A]/10">
                      <div className="inline-flex p-4 rounded-full bg-[#FDF8F4] mb-4">
                        <Search className="w-8 h-8 text-[#E84A8A]/40" />
                      </div>
                      <h3 className="text-lg font-bold text-[#7B4B94] mb-1">No products found</h3>
                      <p className="text-[#7B4B94]/60 mb-6 text-sm">Adjust your filters to see more results.</p>
                      <button
                        onClick={() => {
                          setCategory(null);
                          setPriceRange([0, 100]);
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete('search');
                          setSearchParams(newParams);
                        }}
                        className="text-[#E84A8A] font-bold text-sm hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </section>

        <QuickAddModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Layout>
    </PageTransition>
  );
};

export default Products;
