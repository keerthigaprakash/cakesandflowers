/**
 * orders.controller.js
 * ────────────────────
 * Route handlers for order operations.
 */

const service = require('./orders.service');

/**
 * POST /api/orders
 */
const placeOrder = async (req, res) => {
  try {
    // user_id can come from the authenticated user (req.user)
    // or be null for guest checkout (if we allow it).
    const user_id = req.user ? req.user.id : null;
    
    const orderData = {
      user_id,
      ...req.body // expected: { items: [], total: 100, shipping_info: {} }
    };

    const order = await service.placeOrder(orderData);
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: order
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to place order.'
    });
  }
};

/**
 * GET /api/orders/my-orders
 */
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await service.getUserOrders(userId);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: 'Failed to fetch orders.'
    });
  }
};

/**
 * GET /api/orders/all
 * Admin only
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await service.getAllOrders();
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: 'Failed to fetch all orders.'
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
};
