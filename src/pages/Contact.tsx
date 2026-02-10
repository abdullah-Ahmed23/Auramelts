import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Phone, Loader2, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { logActivity } from '@/lib/logger';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { contactSchema } from '@/lib/validations';
import PageTransition from '@/components/PageTransition';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    // Validate with Zod
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    // Check Turnstile token
    if (!turnstileToken) {
      toast.error('Please complete the security check');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('messages').insert([data]);
      if (error) throw error;
      await logActivity('New Message', `Message received from ${data.name} (${data.email})`, 'create');
      toast.success('Message sent successfully! We will get back to you soon.');
      form.reset();
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Layout>
        <section className="pt-24 pb-20 md:pt-32 md:pb-28 bg-gradient-to-br from-[#FDF8F4] to-[#F5F0E6] relative overflow-hidden">
          {/* Background Elements - Optimized */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#5CC5B5]/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#E84A8A]/10 rounded-full blur-[70px] pointer-events-none" />

          <div className="container relative mx-auto px-4 max-w-7xl z-10">
            {/* Header */}
            <motion.div
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#5CC5B5]/10 border border-[#5CC5B5]/20">
                <Mail className="w-4 h-4 text-[#5CC5B5]" />
                <span className="text-xs font-semibold tracking-wider uppercase text-[#5CC5B5]">Contact Us</span>
              </div>

              <h1 className="mb-4 text-4xl md:text-6xl font-bold text-[#7B4B94]">
                Let's Start a <span className="italic text-[#E84A8A]">Conversation</span>
              </h1>
              <p className="text-[#7B4B94]/60 text-lg max-w-2xl mx-auto">
                We're here to help and answer any question you might have. We look forward to hearing from you.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

              {/* Left Side - Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Contact Cards */}
                <div className="space-y-6">
                  <motion.a
                    href="tel:+201018405310"
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-6 rounded-2xl bg-white/80 border border-[#E84A8A]/10 hover:border-[#5CC5B5]/30 hover:shadow-lg transition-all group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#5CC5B5]/10 flex items-center justify-center group-hover:bg-[#5CC5B5]/20 transition-colors">
                      <Phone className="w-7 h-7 text-[#5CC5B5]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#7B4B94]/60 font-medium mb-1">Call Us</p>
                      <p className="text-[#7B4B94] font-bold text-lg">+20 10 18405310</p>

                    </div>
                  </motion.a>
                </div>

                {/* Social Media */}
                <div className="bg-white/60 rounded-2xl p-6 border border-[#E84A8A]/10">
                  <p className="text-[#7B4B94] text-sm font-semibold mb-4">Connect With Us</p>
                  <div className="flex gap-3">
                    <motion.a
                      href="#"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E84A8A]/10 to-[#E84A8A]/5 border border-[#E84A8A]/20 flex items-center justify-center hover:from-[#E84A8A]/20 hover:to-[#E84A8A]/10 transition-all"
                    >
                      <Instagram className="w-5 h-5 text-[#E84A8A]" />
                    </motion.a>
                    <motion.a
                      href="#"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5CC5B5]/10 to-[#5CC5B5]/5 border border-[#5CC5B5]/20 flex items-center justify-center hover:from-[#5CC5B5]/20 hover:to-[#5CC5B5]/10 transition-all"
                    >
                      <Facebook className="w-5 h-5 text-[#5CC5B5]" />
                    </motion.a>
                    <motion.a
                      href="#"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B4B94]/10 to-[#7B4B94]/5 border border-[#7B4B94]/20 flex items-center justify-center hover:from-[#7B4B94]/20 hover:to-[#7B4B94]/10 transition-all"
                    >
                      <MessageCircle className="w-5 h-5 text-[#7B4B94]" />
                    </motion.a>
                  </div>
                </div>

                {/* Decorative Quote */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="hidden lg:block mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#E84A8A]/5 to-transparent border border-[#E84A8A]/10"
                >
                  <p className="text-[#7B4B94] italic text-lg mb-2">
                    "Every message matters to us. We're committed to providing you with the best experience."
                  </p>
                  <p className="text-[#E84A8A] font-semibold text-sm">— Aura Melts Team</p>
                </motion.div>
              </motion.div>

              {/* Right Side - Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-[#7B4B94]/10 border border-[#E84A8A]/10"
              >
                <h2 className="text-2xl font-bold text-[#7B4B94] mb-6">Send us a Message</h2>

                <form ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#7B4B94] mb-2">Name *</label>
                      <input
                        name="name"
                        required
                        type="text"
                        placeholder="Your name"
                        className="w-full rounded-xl border border-[#E84A8A]/15 bg-[#FDF8F4] px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/20 focus:border-[#E84A8A] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#7B4B94] mb-2">Phone</label>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+20 123 456 7890"
                        className="w-full rounded-xl border border-[#E84A8A]/15 bg-[#FDF8F4] px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/20 focus:border-[#E84A8A] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#7B4B94] mb-2">Email *</label>
                    <input
                      name="email"
                      required
                      type="email"
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-[#E84A8A]/15 bg-[#FDF8F4] px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/20 focus:border-[#E84A8A] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#7B4B94] mb-2">Subject *</label>
                    <input
                      name="subject"
                      required
                      type="text"
                      placeholder="What's this about?"
                      className="w-full rounded-xl border border-[#E84A8A]/15 bg-[#FDF8F4] px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/20 focus:border-[#E84A8A] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#7B4B94] mb-2">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      className="w-full rounded-xl border border-[#E84A8A]/15 bg-[#FDF8F4] px-4 py-3 text-[#7B4B94] placeholder:text-[#7B4B94]/40 focus:outline-none focus:ring-2 focus:ring-[#E84A8A]/20 focus:border-[#E84A8A] transition-all resize-none"
                    />
                  </div>

                  {/* Turnstile CAPTCHA */}
                  <div className="flex justify-center">
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                      onSuccess={setTurnstileToken}
                      onError={() => setTurnstileToken(null)}
                      onExpire={() => setTurnstileToken(null)}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#E84A8A] to-[#7B4B94] hover:shadow-lg hover:shadow-[#E84A8A]/30 font-semibold text-sm uppercase tracking-wider transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Send Message <Send className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </PageTransition>
  );
};

export default Contact;
