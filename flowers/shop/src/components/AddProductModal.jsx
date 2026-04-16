import React, { useState } from 'react';
import './AddProductModal.css';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'cakes',
    description: '',
    image_key: '',
  });
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
      const response = await fetch('http://127.0.0.1:5000/api/home/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.id || data.success) {
        alert('Product added successfully! 🌸');
        onProductAdded();
        onClose();
        setFormData({ name: '', price: '', category: 'cakes', description: '', image_key: '' });
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
            <label>Image URL / Key</label>
            <input type="text" name="image_key" value={formData.image_key} onChange={handleChange} placeholder="URL or image name (e.g. cake1)" />
            <small>Tip: Use 'cake1', 'flower1', or a full image URL</small>
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
