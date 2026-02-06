import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, ArrowLeft, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { getProductById, products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

const ProductDetail = () => {
  const { id } = useParams();
  const product = getProductById(id || '');
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="mb-4 font-heading text-2xl font-bold">Product Not Found</h1>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <Layout>
      <section className="pt-24 pb-8 md:pt-32 md:pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="overflow-hidden rounded-2xl border border-border">
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-square w-full object-cover"
                />
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              {product.bestSeller && (
                <span className="mb-3 inline-block w-fit rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
                  ⭐ Best Seller
                </span>
              )}
              {product.newArrival && (
                <span className="mb-3 inline-block w-fit rounded-full bg-secondary px-4 py-1 text-xs font-semibold text-secondary-foreground">
                  ✨ New Arrival
                </span>
              )}

              <h1 className="mb-2 font-heading text-3xl font-bold text-foreground md:text-4xl">
                {product.name}
              </h1>

              {product.scent && (
                <p className="mb-3 text-sm text-muted-foreground">Scent: {product.scent}</p>
              )}

              <div className="mb-2 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">(24 reviews)</span>
              </div>

              <p className="mb-6 font-heading text-3xl font-bold text-primary">
                {product.price.toLocaleString()} EGP
              </p>

              <p className="mb-6 text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-foreground">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-foreground hover:border-primary'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                className="rounded-full text-base"
                onClick={() => addItem(product, quantity, selectedSize)}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart — {(product.price * quantity).toLocaleString()} EGP
              </Button>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
                You Might Also Like
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-base font-semibold text-foreground">{p.name}</h3>
                      <p className="text-sm font-bold text-primary">{p.price.toLocaleString()} EGP</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
