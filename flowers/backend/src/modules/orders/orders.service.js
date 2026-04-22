/**
 * orders.service.js
 * ─────────────────
 * Business logic for the Orders module.
 */

const model = require('./orders.model');

/**
 * Places a new order.
 * @param {Object} orderData - Contains user_id (optional), items, total, and shipping_info.
 */
const placeOrder = async (orderData) => {
  const { items, total } = orderData;

  if (!items || items.length === 0) {
    const error = new Error('Cart is empty.');
    error.statusCode = 400;
    throw error;
  }

  if (!total || total <= 0) {
    const error = new Error('Invalid order total.');
    error.statusCode = 400;
    throw error;
  }

  // Map frontend item format to backend if necessary
  const formattedItems = items.map(item => ({
    product_id: item.id || item.product_id, // Map frontend 'id' to 'product_id'
    quantity: item.quantity || 1,
    price: item.price
  }));

  try {
    const order = await model.createOrder({
      ...orderData,
      items: formattedItems
    });
    return order;
  } catch (error) {
    console.error('Order Service Error:', error.message);
    throw error;
  }
};

/**
 * Retrieves orders for a specific user.
 */
const getUserOrders = async (userId) => {
  return model.getOrdersByUserId(userId);
};

/**
 * Retrieves all orders for the admin.
 */
const getAllOrders = async () => {
  return model.getAllOrders();
};

/**
 * Assigns an order to a delivery person.
 */
const assignOrder = async (orderId, deliveryPersonId) => {
  return model.updateOrderAssignment(orderId, deliveryPersonId);
};

/**
 * Updates the status of an order.
 */
const updateStatus = async (orderId, status) => {
  return model.updateOrderStatus(orderId, status);
};

/**
 * Fetches all delivery personnel.
 */
const getDeliveryPersonnel = async () => {
  return model.getDeliveryPersonnel();
};

/**
 * Fetches orders assigned to a specific delivery person.
 */
const getAssignedOrders = async (deliveryPersonId) => {
  return model.getAssignedOrders(deliveryPersonId);
};

/**
 * Cancels/Deletes an order.
 */
const cancelOrder = async (orderId) => {
  return model.deleteOrder(orderId);
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  assignOrder,
  updateStatus,
  getDeliveryPersonnel,
  getAssignedOrders,
  cancelOrder,
};
