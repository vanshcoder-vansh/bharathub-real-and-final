import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import Navbar from '../components/Navbar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://bharathub-backend.onrender.com";
const API = `${BACKEND_URL}/api`;

const AdminEditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchingCategory, setFetchingCategory] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchCategory();
  }, [user, categoryId]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${API}/admin/categories`);
      const category = response.data.find(c => c.id === categoryId);
      
      if (!category) {
        toast({ title: 'Error', description: 'Category not found', variant: 'destructive' });
        navigate('/admin/categories');
        return;
      }
      
      setFormData(category);
      setFetchingCategory(false);
    } catch (error) {
      console.error('Error fetching category:', error);
      setFetchingCategory(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        image: formData.image,
        banner: formData.banner
      };

      await axios.put(`${API}/admin/categories/${categoryId}`, updateData);
      toast({ title: 'Success', description: 'Category updated successfully' });
      navigate('/admin/categories');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update category',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  if (fetchingCategory || !formData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/categories')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Categories
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Category</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="image">Category Image URL</Label>
              <Input
                id="image"
                name="image"
                required
                value={formData.image}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">Used in category cards</p>
            </div>

            <div>
              <Label htmlFor="banner">Category Banner URL</Label>
              <Input
                id="banner"
                name="banner"
                value={formData.banner || ''}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">Large banner for category page</p>
            </div>

            {/* Current Product Count */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Current Products:</strong> {formData.product_count}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formData.product_count > 0 
                  ? 'Category can only be deleted when product count is 0' 
                  : 'This category can be safely deleted'}
              </p>
            </div>

            {/* Preview */}
            {formData.image && (
              <div>
                <Label>Image Preview</Label>
                <div className="mt-2 aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Updating...' : 'Update Category'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/categories')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditCategory;
