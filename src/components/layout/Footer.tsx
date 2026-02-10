import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground">Aura Melts</h3>
            <p className="font-body text-sm text-muted-foreground">
              Handcrafted candles & wax melts made with love. Bringing warmth and fragrance to every home.
            </p>
            <a href="tel:+201018405310" className="font-body text-sm font-bold text-[#7B4B94] hover:text-[#E84A8A] transition-colors inline-block">+20 10 18405310</a>
            <div className="flex items-center gap-3">
              <a href="#" className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Products</h4>
            <div className="flex flex-col gap-2">
              <Link to="/products?category=candles" className="text-sm text-muted-foreground transition-colors hover:text-primary">Candles</Link>
              <Link to="/products?category=wax-melts" className="text-sm text-muted-foreground transition-colors hover:text-primary">Wax Melts</Link>
              <Link to="/products?category=diffusers" className="text-sm text-muted-foreground transition-colors hover:text-primary">Diffusers</Link>
              <Link to="/products?category=accessories" className="text-sm text-muted-foreground transition-colors hover:text-primary">Accessories</Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Company</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">About Us</Link>
              <Link to="/faq" className="text-sm text-muted-foreground transition-colors hover:text-primary">FAQ</Link>
              <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">Contact</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Stay Connected</h4>
            <p className="text-sm text-muted-foreground">Get 10% off your first order when you sign up!</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-border pt-6 text-center">
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-3 w-3 fill-primary text-primary" /> by <a href="https://www.facebook.com/profile.php?id=100035910953594" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Abdullah Ahmed</a>
          </p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Aura Melts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
