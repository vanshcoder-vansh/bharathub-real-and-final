import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://bharathub-backend.onrender.com";
const API = `${BACKEND_URL}/api`;

const AdminCategories = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/admin/categories`);
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId, categoryName, productCount) => {
    if (productCount > 0) {
      toast({
        title: 'Cannot Delete',
        description: `This category has ${productCount} products. Delete products first.`,
        variant: 'destructive'
      });
      return;
    }

    if (!window.confirm(`Delete "${categoryName}"?`)) return;

    try {
      await axios.delete(`${API}/admin/categories/${categoryId}`);
      toast({ title: 'Success', description: 'Category deleted successfully' });
      fetchCategories();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete category',
        variant: 'destructive'
      });
    }
  };

  if (!user || user.role !== 'admin') return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 mt-1">Total: {categories.length} categories</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/admin/categories/add">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                Add Category
              </Button>
            </Link>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              {/* Category Banner */}
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={category.banner || category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">Slug: {category.slug}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {category.product_count} Products
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(category.id, category.name, category.product_count)}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    disabled={category.product_count > 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">No categories found</p>
            <Link to="/admin/categories/add">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                Create First Category
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;