import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './modules/home/Home';
import Products from './modules/products/Products';
import ProductDetails from './modules/productDetails/ProductDetails.jsx';
import Gifts from './modules/gifts/Gifts';
import Cart from './modules/cart/Cart';
import Checkout from './modules/checkout/Checkout';
import Login from './login/Login.jsx';
import Signup from './login/Signup.jsx';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Add item to cart
  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: product.quantity || 1 }];
    });
  };

  // Remove item from cart
  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Update item quantity
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const clearCart = () => setCartItems([]);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleProductAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Router>
      <div className="main-container">
        <Navbar cartCount={cartItems.length} user={user} />

        <div className="content">
          <Routes>
            <Route path="/" element={<Home onAddToCart={handleAddToCart} refreshTrigger={refreshTrigger} />} />
            <Route path="/products" element={<Products onAddToCart={handleAddToCart} refreshTrigger={refreshTrigger} />} />
            <Route path="/product/:id" element={<ProductDetails onAddToCart={handleAddToCart} />} />
            <Route path="/gifts" element={<Gifts onAddToCart={handleAddToCart} refreshTrigger={refreshTrigger} />} />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  onRemoveFromCart={handleRemoveFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              }
            />
            <Route path="/checkout" element={
              <Checkout
                cartItems={cartItems}
                user={user}
                onOrderSuccess={clearCart}
              />}
            />
            <Route path="/login" element={
              <Login
                onLogin={handleAuthSuccess}
                onSwitchToSignup={() => {}} // Now handled by navigation
              />}
            />
            <Route path="/signup" element={
              <Signup
                onSignup={handleAuthSuccess}
                onSwitchToLogin={() => {}} // Now handled by navigation
              />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <FloatingAddButton onClick={() => setIsModalOpen(true)} />
        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onProductAdded={handleProductAdded} 
        />

        <Footer />
      </div>
    </Router>
  );
}

export default App;