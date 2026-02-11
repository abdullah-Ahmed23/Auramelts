export type ProductCategory = 'candles' | 'wax-melts' | 'diffusers' | 'accessories';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  scent?: string;
  sizes?: string[];
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  stock?: number;
  variants?: { name: string; price: number; stock?: number }[];
}

export const categories = [
  { id: 'candles' as ProductCategory, name: 'Candles', icon: '🕯️', description: 'Hand-poured nature wax candles with natural fragrances' },
  { id: 'wax-melts' as ProductCategory, name: 'Wax Melts', icon: '🫠', description: 'Scented wax melts for your burner' },
  { id: 'diffusers' as ProductCategory, name: 'Diffusers', icon: '🌸', description: 'Reed diffusers for lasting fragrance' },
  { id: 'accessories' as ProductCategory, name: 'Accessories', icon: '✨', description: 'Candle care tools and more' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Vanilla Dream',
    description: 'A warm and inviting blend of Madagascar vanilla and sweet amber, creating the perfect cozy atmosphere for relaxing evenings.',
    price: 650,
    image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=500&h=500&fit=crop',
    category: 'candles',
    scent: 'Vanilla & Amber',
    variants: [
      { name: 'Small (4oz)', price: 450, stock: 10 },
      { name: 'Medium (8oz)', price: 650, stock: 15 },
      { name: 'Large (12oz)', price: 850, stock: 5 }
    ],
    sizes: ['Small (4oz)', 'Medium (8oz)', 'Large (12oz)'], // Keep for backward compat if needed, or remove
    featured: true,
    bestSeller: true,
    stock: 30
  },
  {
    id: '2',
    name: 'Lavender Fields',
    description: 'Transport yourself to the rolling lavender fields of Provence with this calming and soothing fragrance.',
    price: 620,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&h=500&fit=crop',
    category: 'candles',
    scent: 'Lavender & Eucalyptus',
    variants: [
      { name: 'Small (4oz)', price: 420 },
      { name: 'Medium (8oz)', price: 620 },
      { name: 'Large (12oz)', price: 820 }
    ],
    featured: true,
    stock: 20
  },
  {
    id: '3',
    name: 'Rose Garden',
    description: 'Delicate rose petals blended with soft musk, capturing the essence of a blooming English rose garden.',
    price: 750,
    image: 'https://images.unsplash.com/photo-1616401784845-180882c0092e?w=500&h=500&fit=crop',
    category: 'candles',
    scent: 'Rose & Musk',
    variants: [
      { name: 'Small (4oz)', price: 550 },
      { name: 'Medium (8oz)', price: 750 },
      { name: 'Large (12oz)', price: 950 }
    ],
    newArrival: true,
    stock: 10
  },
  {
    id: '4',
    name: 'Cinnamon Spice',
    description: 'Warm cinnamon bark and spiced clove create a cozy, festive atmosphere perfect for any season.',
    price: 640,
    image: 'https://images.unsplash.com/photo-1608181831718-c9ffd6764abe?w=500&h=500&fit=crop',
    category: 'candles',
    scent: 'Cinnamon & Clove',
    variants: [
      { name: 'Small (4oz)', price: 440 },
      { name: 'Medium (8oz)', price: 640 },
      { name: 'Large (12oz)', price: 840 }
    ],
    bestSeller: true,
    stock: 0
  },
  {
    id: '5',
    name: 'Ocean Breeze Melts',
    description: 'Fresh sea salt and driftwood notes bring the calming ocean breeze right into your home.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1631116622704-72e66bfd1c5b?w=500&h=500&fit=crop',
    category: 'wax-melts',
    scent: 'Sea Salt & Driftwood',
    featured: true,
  },
  {
    id: '6',
    name: 'Citrus Burst Melts',
    description: 'Zesty lemon and sweet orange melt together for an energizing and uplifting fragrance experience.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1599751449128-eb7249c3d6b1?w=500&h=500&fit=crop',
    category: 'wax-melts',
    scent: 'Lemon & Orange',
    newArrival: true,
  },
  {
    id: '7',
    name: 'Peony Blush Melts',
    description: 'Soft peony blossoms with a hint of raspberry create a romantic and feminine scent.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1596397249259-1ab784fddeb3?w=500&h=500&fit=crop',
    category: 'wax-melts',
    scent: 'Peony & Raspberry',
    bestSeller: true,
  },
  {
    id: '8',
    name: 'Eucalyptus Reed Diffuser',
    description: 'Long-lasting eucalyptus and mint reed diffuser that naturally freshens any room for weeks.',
    price: 950,
    image: 'https://images.unsplash.com/photo-1595535373192-fc8935bacd89?w=500&h=500&fit=crop',
    category: 'diffusers',
    scent: 'Eucalyptus & Mint',
    featured: true,
    bestSeller: true,
  },
  {
    id: '9',
    name: 'Jasmine Night Diffuser',
    description: 'Exotic jasmine and sandalwood create a luxurious evening atmosphere that lasts for weeks.',
    price: 980,
    image: 'https://images.unsplash.com/photo-1600001050893-42aab0e8a988?w=500&h=500&fit=crop',
    category: 'diffusers',
    scent: 'Jasmine & Sandalwood',
    newArrival: true,
  },
  {
    id: '10',
    name: 'Candle Care Kit',
    description: 'Everything you need to care for your candles — wick trimmer, snuffer, and dipper in beautiful gold.',
    price: 750,
    image: 'https://images.unsplash.com/photo-1616401784845-180882c0092e?w=500&h=500&fit=crop',
    category: 'accessories',
    featured: true,
  },
  {
    id: '11',
    name: 'Wax Melt Burner — Ceramic',
    description: 'Handmade ceramic wax melt burner with a minimalist design that complements any home decor.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=500&h=500&fit=crop',
    category: 'accessories',
    bestSeller: true,
  },
  {
    id: '12',
    name: 'Match Bottle Set',
    description: 'Stylish glass bottle filled with premium matches and a striker pad. Perfect gift accessory.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&h=500&fit=crop',
    category: 'accessories',
    newArrival: true,
  },
];

export const getProductsByCategory = (category: ProductCategory) =>
  products.filter((p) => p.category === category);

export const getFeaturedProducts = () =>
  products.filter((p) => p.featured);

export const getBestSellers = () =>
  products.filter((p) => p.bestSeller);

export const getNewArrivals = () =>
  products.filter((p) => p.newArrival);

export const getProductById = (id: string) =>
  products.find((p) => p.id === id);
