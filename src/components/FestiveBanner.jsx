import React, { useState, useEffect } from 'react';
import { X, Gift, Sparkles } from 'lucide-react';

const FestiveBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    // Check if user has dismissed banner
    const dismissed = localStorage.getItem('festive-banner-dismissed');
    if (dismissed) {
      setIsVisible(false);
    }

    // Auto-hide after January 5, 2025
    const currentDate = new Date();
    const endDate = new Date('2025-01-05T23:59:59');
    if (currentDate > endDate) {
      setShouldShow(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('festive-banner-dismissed', 'true');
  };

  if (!isVisible || !shouldShow) return null;

  return (
    <div className="bg-gradient-to-r from-red-700 via-green-700 to-red-700 text-white py-2 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 justify-center">
          <Gift className="w-5 h-5 animate-bounce" />
          <span className="font-semibold text-sm md:text-base">
            🎄 Festive Deals • New Year Savings Are Live!
          </span>
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <button
          onClick={handleDismiss}
          className="text-white hover:text-gray-200 transition-colors ml-4"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
    </div>
  );
};

export default FestiveBanner;
