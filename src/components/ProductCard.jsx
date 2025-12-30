import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, showBestseller = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
      });
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const displayImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.image;

  return (
    <Link to={`/product/${product.slug}`}>
      <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.discount && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {product.discount}% OFF
              </span>
            )}
            {showBestseller && product.bestseller && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Bestseller
              </span>
            )}
            {product.cod_available && (
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                COD
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({product.review_count?.toLocaleString()})</span>
          </div>

          {/* Sold Count (for bestsellers) */}
          {showBestseller && product.sold_count && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">{product.sold_count > 1000 ? `${(product.sold_count/1000).toFixed(1)}k` : product.sold_count}</span> sold
            </p>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through">₹{product.original_price?.toLocaleString()}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
