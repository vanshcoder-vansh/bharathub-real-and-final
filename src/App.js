import React, { useEffect } from "react";
import "./App.css";
import "./festive-theme.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "./components/ui/toaster";
import FestiveBanner from "./components/FestiveBanner";
import FestiveDecorations from "./components/FestiveDecorations";
import { applyFestiveTheme, festiveConfig } from "./festiveConfig";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminImportCSV from "./pages/AdminImportCSV";
import AdminCategories from "./pages/AdminCategories";
import AdminAddCategory from "./pages/AdminAddCategory";
import AdminEditCategory from "./pages/AdminEditCategory";

function App() {
  useEffect(() => {
    // Apply festive theme on mount
    applyFestiveTheme();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            {/* Festive Banner */}
            {festiveConfig.showBanner && <FestiveBanner />}
            
            {/* Festive Decorations */}
            {festiveConfig.showDecorations && <FestiveDecorations />}
            
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<OrdersPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/add" element={<AdminAddProduct />} />
              <Route path="/admin/products/edit/:productId" element={<AdminEditProduct />} />
              <Route path="/admin/products/import" element={<AdminImportCSV />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/categories/add" element={<AdminAddCategory />} />
              <Route path="/admin/categories/edit/:categoryId" element={<AdminEditCategory />} />
            </Routes>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
