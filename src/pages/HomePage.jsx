import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import TrendingProducts from '../components/TrendingProducts';
import BestSellingProducts from '../components/BestSellingProducts';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <TrendingProducts />
      <BestSellingProducts />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default HomePage;
