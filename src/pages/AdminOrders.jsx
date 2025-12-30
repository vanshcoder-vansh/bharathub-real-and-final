import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import Navbar from '../components/Navbar';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://bharathub-backend.onrender.com";
const API = `${BACKEND_URL}/api`;

const AdminOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [orders, search, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/admin/orders`);
      setOrders(response.data);
      setFilteredOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (search) {
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(search.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        order.customer_phone.includes(search)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderNumber, newStatus) => {
    try {
      await axios.put(`${API}/admin/orders/${orderNumber}/status`, { status: newStatus });
      toast({
        title: "Success",
        description: `Order ${orderNumber} status updated to ${newStatus}`
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">Total: {filteredOrders.length} orders</p>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by order #, customer name, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow">
              {/* Order Header */}
              <div className="px-6 py-4 border-b bg-gray-50 cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="text-sm text-gray-500">Order Number</p>
                      <p className="font-bold text-gray-900">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{order.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order.id && (
                <div className="px-6 py-4">
                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4">
                          <img src={item.product_image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.product_name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity} × ₹{item.price}</p>
                          </div>
                          <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-gray-700">
                      {order.shipping_address.street}<br />
                      {order.shipping_address.city}, {order.shipping_address.state}<br />
                      PIN: {order.shipping_address.pincode}
                    </p>
                  </div>

                  {/* Status Update */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => updateOrderStatus(order.order_number, 'pending')}
                        variant="outline"
                        className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                        disabled={order.status === 'pending'}
                      >
                        Pending
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.order_number, 'confirmed')}
                        variant="outline"
                        className="border-blue-500 text-blue-700 hover:bg-blue-50"
                        disabled={order.status === 'confirmed'}
                      >
                        Confirm
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.order_number, 'shipped')}
                        variant="outline"
                        className="border-purple-500 text-purple-700 hover:bg-purple-50"
                        disabled={order.status === 'shipped'}
                      >
                        Ship
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.order_number, 'delivered')}
                        variant="outline"
                        className="border-green-500 text-green-700 hover:bg-green-50"
                        disabled={order.status === 'delivered'}
                      >
                        Delivered
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.order_number, 'cancelled')}
                        variant="outline"
                        className="border-red-500 text-red-700 hover:bg-red-50"
                        disabled={order.status === 'cancelled'}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
