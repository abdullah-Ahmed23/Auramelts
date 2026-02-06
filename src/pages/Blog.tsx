import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const blogPosts = [
  {
    id: '1',
    title: 'The Ultimate Candle Care Guide',
    excerpt: 'Learn how to make your candles last longer and burn more evenly with these simple tips.',
    image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=600&h=400&fit=crop',
    date: 'Jan 15, 2026',
    readTime: '5 min read',
    category: 'Candle Care',
    color: '#E84A8A'
  },
  {
    id: '2',
    title: 'Scent Guide: Finding Your Perfect Fragrance',
    excerpt: 'Not sure which scent is right for you? Our comprehensive guide will help you discover your signature fragrance.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=400&fit=crop',
    date: 'Jan 8, 2026',
    readTime: '7 min read',
    category: 'Guides',
    color: '#5CC5B5'
  },
  {
    id: '3',
    title: 'Behind the Scenes: How We Make Our Candles',
    excerpt: 'Take a peek into our workshop and see the love and craftsmanship that goes into every Aura Melts product.',
    image: 'https://images.unsplash.com/photo-1608181831718-c9ffd6764abe?w=600&h=400&fit=crop',
    date: 'Dec 20, 2025',
    readTime: '4 min read',
    category: 'Behind the Scenes',
    color: '#7B4B94'
  },
  {
    id: '4',
    title: '5 Ways to Create a Cozy Evening at Home',
    excerpt: 'Transform your space into a cozy retreat with candles, soft lighting, and simple self-care rituals.',
    image: 'https://images.unsplash.com/photo-1616401784845-180882c0092e?w=600&h=400&fit=crop',
    date: 'Dec 12, 2025',
    readTime: '6 min read',
    category: 'Lifestyle',
    color: '#F5A623'
  },
];

const Blog = () => {
  return (
    <Layout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-[#FDF8F4] relative overflow-hidden min-h-screen">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#5CC5B5]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#E84A8A]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative mx-auto px-4 max-w-6xl z-10">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-6 inline-block text-5xl">✨</span>
            <h1 className="mb-4 text-4xl font-bold text-[#7B4B94] md:text-5xl">
              Stories & <span className="italic text-[#E84A8A]">Tips</span>
            </h1>
            <p className="text-[#7B4B94]/70 text-lg">Inspiration, guides, and behind-the-scenes from the Aura Melts world</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-3xl border border-[#E84A8A]/15 bg-white shadow-md hover:shadow-xl transition-all"
              >
                <div className="overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-7">
                  <div className="mb-4 flex items-center gap-3 text-xs">
                    <span
                      className="rounded-full px-4 py-1.5 font-semibold"
                      style={{ backgroundColor: `${post.color}15`, color: post.color }}
                    >
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-[#7B4B94]/50">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </span>
                    <span className="text-[#7B4B94]/50">{post.date}</span>
                  </div>
                  <h2 className="mb-3 text-xl font-bold text-[#7B4B94] transition-colors group-hover:text-[#E84A8A]">
                    {post.title}
                  </h2>
                  <p className="mb-5 text-sm text-[#7B4B94]/60 leading-relaxed">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#E84A8A]">
                    Read more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
