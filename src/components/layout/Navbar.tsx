import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.jpeg';
import NavHoverLink from './NavHoverLink';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
// Removed hardcoded imports
// import { categories, products } from '@/data/products';

import { Facebook, Instagram, Twitter, Search, ShoppingBag, Menu, X, ChevronDown, Loader2 } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products', hasDropdown: true },
  { to: '/faq', label: 'FAQ' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]); // Dynamic results
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Fetch Categories from Supabase
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) console.error('Error fetching categories:', error);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
    const isScrollingUp = latest < lastScrollY.current;

    if (latest < 30) {
      setIsExpanded(true);
    } else if (isScrollingUp) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }

    lastScrollY.current = latest;
  });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for better performance
  const performSearch = useCallback(async (query: string) => {
    if (query.trim().length > 1) {
      setIsSearching(true);
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .ilike('name', `%${query}%`)
          .limit(5);
        setSearchResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  }, []);

  // Debounce search with 300ms delay
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (query: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => performSearch(query), 300);
    };
  }, [performSearch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/products?category=${categorySlug}`);
    setIsCategoriesOpen(false);
    setIsMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? 'bg-[#FFF9F0]/80 backdrop-blur-xl shadow-lg border-b border-[#E6C9C9]/20'
          : 'bg-transparent backdrop-blur-none border-b border-transparent'
          }`}
      >
        <div className="w-full px-2 lg:px-4">
          {/* ROW 1: Desktop - Hidden on Mobile */}
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
              marginBottom: isExpanded ? '1rem' : 0
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: isExpanded ? 'height, opacity' : 'auto' }}
            className="hidden lg:block overflow-visible"
          >
            <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <Link to="/" className="group flex items-center gap-3 transition-all">
                <img
                  src={logo}
                  alt="Aura Melts"
                  className="h-10 w-10 rounded-full object-cover shadow-md transition-all group-hover:shadow-lg group-hover:shadow-[#E84A8A]/20 lg:h-12 lg:w-12"
                />
                <span className="font-heading text-xl font-bold tracking-[0.1em] text-[#7B4B94] lg:text-2xl drop-shadow-sm transition-colors group-hover:text-[#E84A8A]">
                  AURA MELTS
                </span>
              </Link>

              {/* Search Bar */}
              <div className="hidden flex-1 items-center justify-center lg:flex relative z-[60]" ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl">
                  <div className="relative flex items-center overflow-hidden rounded-full bg-white border border-[#E84A8A]/20 shadow-sm focus-within:border-[#E84A8A]/40 focus-within:shadow-md focus-within:shadow-[#E84A8A]/10 transition-all">
                    <div className="pl-5 text-[#7B4B94]/40">
                      {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      placeholder="Search for candles, senses, wax melts..."
                      className="flex-1 bg-transparent px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 bg-[#E84A8A] text-white rounded-full m-1 hover:bg-[#D43D7A] transition-colors font-medium text-sm"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Search Results Dropdown - Outside form to avoid clipping */}
                <AnimatePresence>
                  {isSearchFocused && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#E84A8A]/20 shadow-2xl max-w-md mx-auto"
                      style={{ zIndex: 9999 }}
                    >
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/products?search=${encodeURIComponent(product.name)}`} // Or /products/id if explicit
                          onClick={() => { setSearchQuery(''); setSearchResults([]); setIsSearchFocused(false); }}
                          className="flex items-center gap-3 px-2 py-3 hover:bg-[#E84A8A]/10 transition-colors border-b border-[#E84A8A]/5 last:border-b-0"
                        >
                          <img
                            src={product.image || 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=100'}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#7B4B94] text-sm truncate">{product.name}</p>
                            <p className="text-xs text-[#7B4B94]/60">{product.scent}</p>
                          </div>
                          <span className="font-bold text-[#E84A8A] shrink-0">{product.price.toLocaleString()} EGP</span>
                        </Link>
                      ))}
                      <Link
                        to={`/products?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => { setSearchQuery(''); setSearchResults([]); setIsSearchFocused(false); }}
                        className="block px-2 py-3 text-center text-sm font-semibold text-[#E84A8A] hover:bg-[#E84A8A]/10 border-t border-[#E84A8A]/15 transition-colors"
                      >
                        View all results →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Mobile Bar - Simple & Clean */}
          <div className="flex h-20 items-center justify-between lg:hidden">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileOpen(false)}>
              <img src={logo} alt="Aura Melts" className="h-10 w-10 rounded-full shadow-sm" />
              <span className="font-heading text-lg font-bold tracking-widest text-[#7B4B94]">AURA MELTS</span>
            </Link>

            <div className="flex items-center gap-4">
              <button
                className="text-[#7B4B94] hover:text-[#E84A8A] transition-colors"
                onClick={() => setIsMobileSearchOpen(true)}
              >
                <Search className="h-6 w-6" />
              </button>
              <button
                className="relative text-[#7B4B94]"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E84A8A] text-[8px] font-bold text-white shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileOpen(true)}
                className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 text-[#7B4B94]"
              >
                <div className="h-0.5 w-6 bg-current" />
                <div className="h-0.5 w-6 bg-current" />
                <div className="h-0.5 w-4 bg-current self-end" />
              </button>
            </div>
          </div>

          {/* Desktop Bottom Row */}
          <div className="hidden border-t border-[#E84A8A]/20 py-10 px-10 lg:flex lg:items-center lg:justify-between h-12 relative z-10">
            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <Button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="gap-2 rounded-full bg-[#7B4B94] hover:bg-[#6A3F82] px-3 xl:px-6 h-10 font-bold tracking-wide text-white shadow-md shadow-[#7B4B94]/30"
              >
                <Menu className="h-4 w-4" />
                <span className="hidden xl:inline">Browse Categories</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </Button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl border border-[#E84A8A]/15 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-2">
                      {/* Dynamic Categories */}
                      {categories.map((cat: any, index: number) => (
                        <motion.button
                          key={cat.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleCategoryClick(cat.slug)}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#E84A8A]/5 transition-all group"
                        >
                          {/* Image or Icon */}
                          <div className="w-12 h-12 rounded-lg bg-[#E84A8A]/5 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                            {cat.image ? (
                              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-2xl">{cat.icon || '✨'}</span>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-[#7B4B94] group-hover:text-[#E84A8A] transition-colors">{cat.name}</p>
                            <p className="text-xs text-[#7B4B94]/50">{cat.description}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    <div className="border-t border-[#E84A8A]/10 p-2">
                      <Link
                        to="/products"
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E84A8A]/5 text-[#E84A8A] font-semibold hover:bg-[#E84A8A]/10 transition-colors"
                      >
                        View All Products →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 xl:gap-8">
              {navLinks.map((link) => (
                <NavHoverLink
                  key={link.label}
                  to={link.to}
                  label={link.label.toUpperCase()}
                  isActive={location.pathname === link.to}
                />
              ))}
            </nav>

            <div className="flex items-center gap-4 xl:gap-6">
              <button
                className="group flex items-center gap-2 text-[#7B4B94] hover:text-[#E84A8A] transition-all relative"
                onClick={() => setIsCartOpen(true)}
              >
                <div className="relative">
                  <ShoppingBag className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E84A8A] text-[8px] font-bold text-white shadow-sm ring-2 ring-[#FFF9F0]">
                      {totalItems}
                    </span>
                  )}
                </div>
                <div className="hidden flex-col items-start lg:flex">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Your Cart</span>
                  <span className="text-xs font-bold text-[#7B4B94] group-hover:text-[#E84A8A] transition-colors">Checkout</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[200] flex flex-col bg-[#FDF8F4] lg:hidden shadow-2xl overflow-y-auto"
          >
            {/* Menu Header */}
            <div className="flex h-20 shrink-0 items-center justify-between px-4 border-b border-[#E84A8A]/10 bg-[#FDF8F4]">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Aura Melts" className="h-8 w-8 rounded-full" />
                <span className="font-heading text-lg font-bold tracking-widest text-[#7B4B94]">AURA MELTS</span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="flex h-12 w-12 items-center justify-center text-[#7B4B94] hover:text-[#E84A8A] transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
            </div>

            {/* Mobile Search - Restored */}
            <div className="px-4 py-4 border-b border-[#E84A8A]/10">
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  setIsMobileSearchOpen(true);
                }}
                className="w-full flex items-center bg-white rounded-full border border-[#E84A8A]/20 px-4 py-2 text-[#7B4B94]/40"
              >
                <Search className="h-5 w-5 mr-3" />
                <span className="text-sm">Search products...</span>
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex flex-1 flex-col py-8 px-6">
              <nav className="flex flex-col gap-6">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.1, duration: 0.6 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsMobileOpen(false)}
                      className="group flex items-center gap-4 py-2"
                    >
                      <span className="text-xl">🌸</span>
                      <span className="font-heading text-3xl font-bold tracking-tight text-[#7B4B94] transition-colors group-hover:text-[#E84A8A]">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Categories - Dynamic */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-10"
              >
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#7B4B94]/50 mb-4">Shop by Category</h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat: any) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#E84A8A]/15 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#E84A8A]/5 flex items-center justify-center overflow-hidden shrink-0">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{cat.icon || '✨'}</span>
                        )}
                      </div>
                      <span className="font-semibold text-[#7B4B94] text-sm">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mt-auto pt-10"
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="h-px w-20 bg-[#E84A8A]/20" />
                  <div className="flex items-center gap-8">
                    {[Facebook, Instagram, Twitter].map((Icon, i) => (
                      <a key={i} href="#" className="p-3 bg-white rounded-full shadow-sm text-[#7B4B94] hover:text-[#E84A8A] transition-all hover:-translate-y-1">
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Fun Footer Slogan */}
            <div className="p-6 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#7B4B94]/40 shrink-0">
              Handcrafted with love • Aura Melts 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Mobile Search Modal */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[201] bg-[#FFF9F0] md:hidden flex flex-col"
          >
            {/* Search Header */}
            <div className="flex h-20 shrink-0 items-center gap-4 px-4 border-b border-[#E84A8A]/10">
              <button
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="p-2 text-[#7B4B94]"
              >
                <X className="h-6 w-6" />
              </button>
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <div className="relative flex items-center bg-white rounded-full border border-[#E84A8A]/20 px-4 py-2">
                  <div className="mr-2">
                    {isSearching ? <Loader2 className="h-5 w-5 animate-spin text-[#7B4B94]/40" /> : <Search className="h-5 w-5 text-[#7B4B94]/40" />}
                  </div>
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent px-3 py-1 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none"
                  />
                </div>
              </form>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {searchQuery.trim().length > 1 ? (
                <div className="space-y-4">
                  {searchResults.length > 0 ? (
                    <>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7B4B94]/40 px-2">
                        Search Results ({searchResults.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            to={`/products?search=${encodeURIComponent(product.name)}`}
                            onClick={() => {
                              setIsMobileSearchOpen(false);
                              setSearchQuery('');
                              setSearchResults([]);
                            }}
                            className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-[#E84A8A]/10 shadow-sm"
                          >
                            <img src={product.image || 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=100'} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[#7B4B94]">{product.name}</p>
                              <p className="text-xs text-[#7B4B94]/60 truncate">{product.scent}</p>
                              <p className="text-sm font-bold text-[#E84A8A] mt-1">{product.price.toLocaleString()} EGP</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Button
                        onClick={handleSearchSubmit}
                        className="w-full h-12 rounded-full bg-[#E84A8A] hover:bg-[#D43D7A] text-white font-bold shadow-lg shadow-[#E84A8A]/20"
                      >
                        View All Results
                      </Button>
                    </>
                  ) : (
                    <div className="py-20 text-center">
                      <div className="w-16 h-16 bg-[#7B4B94]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-[#7B4B94]/20" />
                      </div>
                      <p className="font-bold text-[#7B4B94]">No products found</p>
                      <p className="text-sm text-[#7B4B94]/50">Try searching for something else</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-sm font-medium text-[#7B4B94]/40">Start typing to search...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
