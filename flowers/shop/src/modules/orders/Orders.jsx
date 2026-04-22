import React, { useEffect, useState } from 'react';
import { getProductImage } from '../../utils/imageMapper';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPersonnel, setDeliveryPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://127.0.0.1:5000/api/orders/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch orders.');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Connection error while fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryPersonnel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/orders/delivery-personnel', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setDeliveryPersonnel(data.data);
    } catch (err) {
      console.error('Error fetching personnel:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPersonnel();
  }, []);

  const handleAssign = async (orderId, deliveryPersonId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/orders/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, deliveryPersonId })
      });
      const data = await response.json();
      if (data.success) {
        fetchOrders(); // Refresh list
      }
    } catch (err) {
      alert('Failed to assign delivery.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5000/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
      }
    } catch (err) {
      alert('Failed to cancel order.');
    }
  };

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="orders-error">{error}</div>;
  }

  return (
    <div className="admin-orders-page">
      <div className="orders-header">
        <h1>All Orders</h1>
      </div>
      
      <div className="orders-list">
        {orders.map(order => {
          const shipping = order.shipping_info || {};
          const customerName = shipping.fullName || order.customer_name || 'Guest';
          const address = [shipping.address, shipping.city, shipping.zip].filter(Boolean).join(', ') || 'N/A';
          const orderDate = new Date(order.created_at).toLocaleString();

          return (
            <div key={order.id} className="order-card">
              <div className="order-summary">
                <div className="order-summary-left">
                  <div className="order-id-row">
                    <h3>Order #{order.id}</h3>
                    <div className="order-actions">
                      <button className="action-btn keep" title="Active">✔</button>
                      <button 
                        className="action-btn cancel" 
                        title="Cancel Order"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                  <p className="order-date">Placed on: {orderDate}</p>
                </div>
                <div className="order-summary-right">
                  <span className="order-total">${Number(order.total).toFixed(2)}</span>
                  <span className={`order-status ${order.status || 'pending'}`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="order-management">
                <div className="order-customer-details">
                  <h4>Customer Details</h4>
                  <p><strong>Name:</strong> {customerName}</p>
                  <p><strong>Delivery Address:</strong> {address}</p>
                  {shipping.phone && <p><strong>Phone:</strong> {shipping.phone}</p>}
                </div>

                <div className="delivery-assignment">
                  <h4>Delivery Assignment</h4>
                  <div className="assignment-control">
                    <select 
                      defaultValue={order.delivery_person_id || ""}
                      onChange={(e) => handleAssign(order.id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {deliveryPersonnel.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    {order.delivery_person_id && (
                      <span className="assigned-badge">Assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="order-items">
                <h4>Items Ordered</h4>
                <div className="items-list">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <img 
                        src={getProductImage(item.product_image)} 
                        alt={item.product_name || 'Product'} 
                        className="item-thumbnail" 
                      />
                      <div className="item-info">
                        <span className="item-name">{item.product_name || 'Unknown Product'}</span>
                        <span className="item-qty">Qty: {item.quantity}</span>
                        <span className="item-price">${Number(item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
