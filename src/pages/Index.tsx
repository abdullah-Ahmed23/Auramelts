import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryCards from '@/components/home/CategoryCards';
import BrandStory from '@/components/home/BrandStory';
import Testimonials from '@/components/home/Testimonials';
import FeedbackForm from '@/components/home/FeedbackForm';
import MiniFAQ from '@/components/home/MiniFAQ';
import Newsletter from '@/components/home/Newsletter';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedProducts />
      <CategoryCards />
      <BrandStory />
      <Testimonials />
      <FeedbackForm />
      <MiniFAQ />
      <Newsletter />
    </Layout>
  );
};

export default Index;
