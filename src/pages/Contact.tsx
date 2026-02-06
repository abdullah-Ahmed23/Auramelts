import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <Layout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-[#F5F0E6] relative overflow-hidden">
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
            <span className="mb-6 inline-block text-5xl">💌</span>
            <h1 className="mb-4 text-4xl font-bold text-[#7B4B94] md:text-5xl">
              Get in <span className="italic text-[#E84A8A]">Touch</span>
            </h1>
            <p className="text-[#7B4B94]/70 text-lg">We'd love to hear from you! Drop us a message anytime.</p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-[#E84A8A]/15 bg-white p-8 md:p-10 shadow-lg shadow-[#E84A8A]/5"
            >
              <h2 className="mb-8 text-2xl font-bold text-[#7B4B94]">Send us a message</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#7B4B94]">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full rounded-xl border border-[#E84A8A]/20 bg-[#FDF8F4] px-5 py-3 text-sm text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#7B4B94]">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-[#E84A8A]/20 bg-[#FDF8F4] px-5 py-3 text-sm text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#7B4B94]">Subject</label>
                  <input
                    type="text"
                    placeholder="What's this about?"
                    className="w-full rounded-xl border border-[#E84A8A]/20 bg-[#FDF8F4] px-5 py-3 text-sm text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#7B4B94]">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full rounded-xl border border-[#E84A8A]/20 bg-[#FDF8F4] px-5 py-3 text-sm text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/30 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 rounded-full px-8 bg-[#E84A8A] hover:bg-[#D43D7A] font-semibold shadow-lg shadow-[#E84A8A]/30"
                  size="lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-5"
            >
              <div className="rounded-2xl border border-[#E84A8A]/15 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E84A8A]/10">
                  <Mail className="h-6 w-6 text-[#E84A8A]" />
                </div>
                <h3 className="mb-1 text-lg font-bold text-[#7B4B94]">Email Us</h3>
                <p className="text-[#7B4B94]/70">hello@auramelts.com</p>
              </div>

              <div className="rounded-2xl border border-[#E84A8A]/15 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5CC5B5]/10">
                  <MapPin className="h-6 w-6 text-[#5CC5B5]" />
                </div>
                <h3 className="mb-1 text-lg font-bold text-[#7B4B94]">Visit Us</h3>
                <p className="text-[#7B4B94]/70">Based in Egypt — shipping nationwide</p>
              </div>

              <div className="rounded-2xl border border-[#E84A8A]/15 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5A623]/10">
                  <Clock className="h-6 w-6 text-[#F5A623]" />
                </div>
                <h3 className="mb-1 text-lg font-bold text-[#7B4B94]">Response Time</h3>
                <p className="text-[#7B4B94]/70">We usually reply within 24 hours</p>
              </div>

              <div className="rounded-2xl border border-[#7B4B94]/20 bg-gradient-to-br from-[#7B4B94]/10 to-[#E84A8A]/10 p-6">
                <h3 className="mb-2 text-lg font-bold text-[#7B4B94]">Custom Orders? 🎁</h3>
                <p className="text-[#7B4B94]/70 leading-relaxed">
                  Looking for wedding favours, corporate gifts, or something special?
                  We'd love to create something unique for you!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
