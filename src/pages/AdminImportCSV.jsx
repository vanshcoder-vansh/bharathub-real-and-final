import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://bharathub-backend.onrender.com";
const API = `${BACKEND_URL}/api`;

const AdminImportCSV = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [csvFile, setCsvFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setResult(null);
    } else {
      toast({ title: 'Error', description: 'Please select a CSV file', variant: 'destructive' });
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map(v => v.trim());
      const product = {};
      headers.forEach((header, index) => {
        product[header] = values[index] || '';
      });
      if (product.name && product.price) products.push(product);
    }
    return products;
  };

  const handleImport = async () => {
    if (!csvFile) {
      toast({ title: 'Error', description: 'Please select a CSV file', variant: 'destructive' });
      return;
    }

    setImporting(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const csvText = e.target.result;
        const products = parseCSV(csvText);

        if (products.length === 0) {
          toast({ title: 'Error', description: 'No products found', variant: 'destructive' });
          setImporting(false);
          return;
        }

        let successCount = 0;
        let failedCount = 0;
        const errors = [];

        for (const product of products) {
          try {
            const category = categories.find(c => 
              c.name.toLowerCase() === product.category?.toLowerCase()
            );

            if (!category) {
              errors.push(`Product "${product.name}": Category not found`);
              failedCount++;
              continue;
            }

            const productData = {
              name: product.name,
              description: product.description || '',
              price: parseFloat(product.price),
              original_price: parseFloat(product.original_price || product.price),
              category_id: category.id,
              image: product.image_url || product.image || '',
              images: [],
              specifications: [],
              features: [],
              stock_quantity: parseInt(product.stock || 100),
              cod_available: product.cod_available !== 'false'
            };

            await axios.post(`${API}/admin/products`, productData);
            successCount++;
          } catch (error) {
            errors.push(`Product "${product.name}": ${error.message}`);
            failedCount++;
          }
        }

        setResult({ total: products.length, success: successCount, failed: failedCount, errors });
        if (successCount > 0) {
          toast({ title: 'Success', description: `Imported ${successCount} products` });
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to parse CSV', variant: 'destructive' });
      } finally {
        setImporting(false);
      }
    };

    reader.readAsText(csvFile);
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button onClick={() => navigate('/admin/products')} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Import Products from CSV</h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">CSV Format:</h3>
            <code className="block bg-white p-2 rounded text-xs">
              name,description,price,original_price,category,image_url,stock,cod_available
            </code>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-upload" />
            <label htmlFor="csv-upload" className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Upload className="w-5 h-5 mr-2" />
              Select CSV
            </label>
            {csvFile && <p className="mt-4 text-sm text-gray-600">{csvFile.name}</p>}
          </div>

          <Button onClick={handleImport} disabled={!csvFile || importing} className="w-full bg-green-600 hover:bg-green-700 py-6">
            {importing ? 'Importing...' : 'Import Products'}
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded text-center">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{result.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-green-600">Success</p>
                  <p className="text-2xl font-bold text-green-700">{result.success}</p>
                </div>
                <div className="bg-red-50 p-4 rounded text-center">
                  <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                  <p className="text-sm text-red-600">Failed</p>
                  <p className="text-2xl font-bold text-red-700">{result.failed}</p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-4 max-h-60 overflow-y-auto">
                  <h4 className="font-semibold text-red-900 mb-2">Errors:</h4>
                  {result.errors.map((error, i) => (
                    <p key={i} className="text-sm text-red-700">• {error}</p>
                  ))}
                </div>
              )}

              <Button onClick={() => navigate('/admin/products')} variant="outline" className="w-full">
                View Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminImportCSV;
