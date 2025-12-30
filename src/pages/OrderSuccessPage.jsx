import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Package, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API}/orders/${orderNumber}`);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8">Thank you for shopping with BharatHub</p>
          
          {order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-bold text-gray-900">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-bold text-gray-900">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-bold text-green-600 capitalize">{order.status}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mt-2">Confirmed</p>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-sm text-gray-600 mt-2">Processing</p>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-sm text-gray-600 mt-2">Delivered</p>
            </div>
          </div>

          <p className="text-gray-600 mb-8">
            Order confirmation sent to phone: <strong>{order?.customer_phone}</strong>
          </p>

          <div className="flex space-x-4 justify-center">
            <Link to="/orders">
              <Button className="bg-blue-600 hover:bg-blue-700">View My Orders</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
