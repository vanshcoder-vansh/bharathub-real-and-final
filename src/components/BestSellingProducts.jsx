import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Award } from 'lucide-react';
import { Button } from './ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BestSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellingProducts();
  }, []);

  const fetchBestSellingProducts = async () => {
    try {
      const response = await axios.get(`${API}/products/bestselling`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bestselling products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center">Loading...</div>;
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-6 h-6 text-yellow-500" />
              <span className="text-sm font-bold text-yellow-600 uppercase tracking-wide">Top Rated</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Best Selling Products</h2>
            <p className="text-lg text-gray-600">Customer favorites with thousands of positive reviews</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showBestseller={true} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/products">
            <Button 
              variant="outline" 
              className="px-8 py-6 text-base font-semibold rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Explore More Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellingProducts;
