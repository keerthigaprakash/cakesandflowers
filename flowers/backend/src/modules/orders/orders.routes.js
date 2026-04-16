/**
 * orders.routes.js
 * ────────────────
 * Route definitions for order module.
 */

const express = require('express');
const router = express.Router();
const controller = require('./orders.controller');
const { authenticate } = require('../../shared/middleware/auth');

// Note: If we want to allow Guest Checkout, we omit 'authenticate' 
// for the POST route, or handle it inside the controller.
// For now, let's allow it so users can place orders easily as requested.
router.post('/', controller.placeOrder);

// This one definitely needs authentication
router.get('/my-orders', authenticate, controller.getMyOrders);

module.exports = router;
