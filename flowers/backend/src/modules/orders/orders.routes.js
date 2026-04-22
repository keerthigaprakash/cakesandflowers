/**
 * orders.routes.js
 * ────────────────
 * Route definitions for order module.
 */

const express = require('express');
const router = express.Router();
const controller = require('./orders.controller');
const { authenticate, authorize } = require('../../shared/middleware/auth');

// Note: If we want to allow Guest Checkout, we omit 'authenticate' 
// for the POST route, or handle it inside the controller.
// For now, let's allow it so users can place orders easily as requested.
router.post('/', controller.placeOrder);

// This one definitely needs authentication
router.get('/my-orders', authenticate, controller.getMyOrders);

// Admin routes
router.get('/all', authenticate, authorize('admin'), controller.getAllOrders);
router.post('/assign', authenticate, authorize('admin'), controller.assignOrder);
router.get('/delivery-personnel', authenticate, authorize('admin'), controller.getDeliveryPersonnel);
router.delete('/:id', authenticate, authorize('admin'), controller.cancelOrder);

// Delivery personnel routes
router.get('/assigned', authenticate, authorize('delivery'), controller.getAssignedOrders);
router.patch('/:id/status', authenticate, controller.updateStatus); // Shared, but will restrict in UI

module.exports = router;
