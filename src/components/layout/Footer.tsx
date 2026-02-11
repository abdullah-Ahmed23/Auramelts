import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#1a1025] text-white pt-20 pb-10 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 mb-16">
          {/* Brand Column */}
          <div data-aos="fade-up" className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block">
              <h3 className="font-heading text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-rose-300 to-primary/80">
                Aura Melts
              </h3>
            </Link>
            <p className="font-body text-gray-300 leading-relaxed max-w-sm">
              Handcrafted candles & wax melts made with love. Bringing warmth, fragrance, and a touch of luxury to every home.
            </p>
            <div className="space-y-2">
              <a
                href="tel:+201018405310"
                className="font-body font-bold text-lg text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
              >
                +20 10 18405310
              </a>
              <p className="text-sm text-gray-400">Cairo, Egypt</p>
            </div>
            <div className="flex items-center gap-4 pt-2">
              {[
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Facebook, label: 'Facebook', href: '#' },
                { icon: Mail, label: 'Email', href: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="rounded-full bg-white/5 p-3 text-gray-300 transition-all duration-300 hover:text-primary hover:bg-[#FF85A1]/20 hover:scale-110 active:scale-95 border border-white/10"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div data-aos="fade-up" data-aos-delay="100" className="lg:col-span-2 lg:col-start-6 space-y-6">
            <h4 className="font-heading text-lg font-semibold text-primary tracking-wide">Shop</h4>
            <ul className="space-y-3">
              {[
                { name: 'Candles', path: '/products?category=candles' },
                { name: 'Wax Melts', path: '/products?category=wax-melts' },
                { name: 'Diffusers', path: '/products?category=diffusers' },
                { name: 'Accessories', path: '/products?category=accessories' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-1 group"
                  >
                    <span className="w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div data-aos="fade-up" data-aos-delay="200" className="lg:col-span-2 space-y-6">
            <h4 className="font-heading text-lg font-semibold text-primary tracking-wide">Company</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Contact', path: '/contact' },
                { name: 'Privacy Policy', path: '/privacy' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-1 group"
                  >
                    <span className="w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


        </div>

        {/* Bottom Bar */}
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} Aura Melts. All rights reserved.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="flex items-center gap-1.5 text-sm text-gray-400">
                Made with <Heart className="h-3.5 w-3.5 fill-primary text-primary animate-pulse" /> by
                <a
                  href="https://www.facebook.com/profile.php?id=100035910953594"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-white hover:text-primary transition-colors relative group min-h-0 inline-flex items-center"
                >
                  Abdullah Ahmed
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
