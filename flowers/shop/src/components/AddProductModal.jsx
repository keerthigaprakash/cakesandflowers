import React, { useState } from 'react';
import './AddProductModal.css';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'cakes',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token') || '';
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('price', formData.price);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      
      if (selectedFile) {
        submitData.append('image', selectedFile);
      }

      const response = await fetch('http://127.0.0.1:5000/api/home/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (data.id || data.success) {
        alert('Product added successfully! 🌸');
        onProductAdded();
        onClose();
        setFormData({ name: '', price: '', category: 'cakes', description: '' });
        setSelectedFile(null);
      } else {
        setError(data.message || 'Failed to add product');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Add New Product 🎁</h2>
        
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Lavender Cupcake" />
          </div>

          <div className="form-group">
            <label>Price (₹) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 250" />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="cakes">Cakes 🎂</option>
              <option value="flowers">Flowers 🌹</option>
              <option value="gifts">Gifts 🎁</option>
              <option value="plants">Plants 🌿</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Brief description of the product..." />
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFile(e.target.files[0]);
                }
              }} 
            />
            <small>Upload a lovely picture from your device.</small>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
