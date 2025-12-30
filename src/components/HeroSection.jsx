import React from 'react';
import { CheckCircle2, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Shop Smart. <br />
              <span className="text-blue-600">Shop BharatHub.</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Your trusted online shopping destination for quality products at honest prices. 
              Experience seamless shopping with Cash on Delivery across India.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">COD Available</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">India-wide Delivery</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
              <Button 
                variant="outline" 
                className="px-8 py-6 text-base font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                Browse Categories
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=600&fit=crop"
                alt="Happy shopper with bags"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-full -z-10"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-50 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
