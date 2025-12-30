import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import Navbar from '../components/Navbar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://bharathub-backend.onrender.com";
const API = `${BACKEND_URL}/api`;

const AdminEditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, productId]);

  const fetchData = async () => {
    try {
      const [productRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/admin/products`),
        axios.get(`${API}/categories`)
      ]);
      
      const product = productRes.data.find(p => p.id === productId);
      if (!product) {
        toast({ title: 'Error', description: 'Product not found', variant: 'destructive' });
        navigate('/admin/products');
        return;
      }
      
      setFormData(product);
      setCategories(categoriesRes.data);
      setFetchingProduct(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setFetchingProduct(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && formData.images.length < 5) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const setAsMainImage = (imageUrl) => {
    setFormData({ ...formData, image: imageUrl });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price),
        category_id: formData.category_id,
        image: formData.image,
        images: formData.images || [],
        stock_quantity: parseInt(formData.stock_quantity),
        cod_available: formData.cod_available
      };

      await axios.put(`${API}/admin/products/${productId}`, updateData);
      toast({ title: 'Success', description: 'Product updated successfully' });
      navigate('/admin/products');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update product',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  if (fetchingProduct || !formData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Products
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="category_id">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price (Rs)</Label>
                <Input id="price" name="price" type="number" required value={formData.price} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="original_price">Original Price (Rs)</Label>
                <Input id="original_price" name="original_price" type="number" value={formData.original_price} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="stock_quantity">Stock</Label>
                <Input id="stock_quantity" name="stock_quantity" type="number" required value={formData.stock_quantity} onChange={handleChange} />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch id="cod_available" checked={formData.cod_available} onCheckedChange={(checked) => setFormData({ ...formData, cod_available: checked })} />
                <Label htmlFor="cod_available">COD Available</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required value={formData.description} onChange={handleChange} rows={4} />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" required value={formData.image} onChange={handleChange} />
              <p className="text-xs text-gray-500 mt-1">Main product image</p>
            </div>

            {/* Product Images Gallery */}
            <div className="border-t pt-6">
              <Label className="text-lg font-semibold">Product Images Gallery</Label>
              <p className="text-sm text-gray-500 mb-4">Manage product gallery images (up to 5 total)</p>
              
              <div className="flex space-x-2 mb-4">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste image URL and click Add"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                />
                <Button 
                  type="button" 
                  onClick={addImageUrl}
                  disabled={formData.images.length >= 5}
                  className="whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                        <img
                          src={imageUrl}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button
                          type="button"
                          onClick={() => setAsMainImage(imageUrl)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-full shadow-lg text-xs"
                          title="Set as main"
                        >
                          Main
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-lg"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-center text-gray-500 mt-1">Image {index + 1}</p>
                    </div>
                  ))}
                </div>
              )}

              {(!formData.images || formData.images.length === 0) && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                  <p className="text-sm">No gallery images</p>
                  <p className="text-xs mt-1">Add image URLs above</p>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {loading ? 'Updating...' : 'Update Product'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProduct;
