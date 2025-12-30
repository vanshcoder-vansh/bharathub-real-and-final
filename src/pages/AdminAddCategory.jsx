import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import Navbar from '../components/Navbar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminAddCategory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    banner: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/admin/categories`, formData);
      toast({ title: 'Success', description: 'Category created successfully' });
      navigate('/admin/categories');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create category',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Category</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Electronics, Fashion, Books"
              />
              <p className="text-xs text-gray-500 mt-1">This will be used to create a URL-friendly slug</p>
            </div>

            <div>
              <Label htmlFor="image">Category Image URL</Label>
              <Input
                id="image"
                name="image"
                required
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/category-image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">Used in category cards (recommended: 500x400px)</p>
            </div>

            <div>
              <Label htmlFor="banner">Category Banner URL (Optional)</Label>
              <Input
                id="banner"
                name="banner"
                value={formData.banner}
                onChange={handleChange}
                placeholder="https://example.com/category-banner.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Large banner for category page header (recommended: 1920x400px). If empty, will use image.
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
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid URL%3C/text%3E%3C/svg%3E';
                    }}
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
                {loading ? 'Creating...' : 'Create Category'}
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

export default AdminAddCategory;