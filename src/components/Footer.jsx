import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg font-medium">Trusted by</span>
          <span className="text-2xl font-bold text-blue-400">50,000+</span>
          <span className="text-lg font-medium">Happy Customers</span>
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        </div>
        <p className="text-gray-400 mt-2">Across India</p>
      </div>
    </footer>
  );
};

export default Footer;
