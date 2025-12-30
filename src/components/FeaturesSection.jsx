import React from 'react';
import { Banknote, Shield, Truck, RefreshCw, BadgeCheck, Headphones } from 'lucide-react';
import { features } from '../mockData';

const iconMap = {
  Banknote: Banknote,
  Shield: Shield,
  Truck: Truck,
  RefreshCw: RefreshCw,
  BadgeCheck: BadgeCheck,
  Headphones: Headphones
};

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose BharatHub?</h2>
          <p className="text-lg text-gray-600">Your trust is our priority. We ensure a safe and seamless shopping experience.</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div
                key={feature.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <IconComponent className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
