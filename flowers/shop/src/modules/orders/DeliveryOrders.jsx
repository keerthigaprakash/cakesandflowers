import React, { useEffect, useState } from 'react';
import './Orders.css';

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAssignedOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/orders/assigned', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch assigned orders.');
      }
    } catch (err) {
      setError('Connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  if (loading) return <div className="orders-loading">Loading assigned orders...</div>;
  if (error) return <div className="orders-error">{error}</div>;

  return (
    <div className="admin-orders-page">
      <div className="orders-header">
        <h1>My Delivery Assignments</h1>
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="orders-empty">
            <p>You have no orders assigned to you yet.</p>
          </div>
        ) : (
          orders.map(order => {
            const shipping = order.shipping_info || {};
            const address = [shipping.address, shipping.city, shipping.zip].filter(Boolean).join(', ') || 'N/A';

            return (
              <div key={order.id} className="order-card">
                <div className="order-summary">
                  <div className="order-summary-left">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">Customer: {order.customer_name || 'Guest'}</p>
                  </div>
                  <div className="order-summary-right">
                    <select 
                      className={`status-select ${order.status}`}
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped/Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="order-customer-details">
                  <h4>Delivery Details</h4>
                  <p><strong>Address:</strong> {address}</p>
                  {shipping.phone && <p><strong>Phone:</strong> {shipping.phone}</p>}
                </div>

                <div className="order-items">
                  <h4>Items</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {(order.items || []).map((item, idx) => (
                      <li key={idx} style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}>
                        {item.product_name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DeliveryOrders;
