/**
 * home.routes.js
 * ──────────────
 * Defines all routes for the Home module and wires them to the controller.
 */

const express = require('express');
const router = express.Router();
const controller = require('./home.controller');
const { authenticate, authorize } = require('../../shared/middleware/auth');

/* ──── Public routes ─────────────────────────────────────────────── */

// Auth
router.post('/auth/register', controller.register);
router.post('/auth/login', controller.login);

// Products (read)
router.get('/products', controller.getProducts);
router.get('/featured', controller.getFeaturedProducts);
router.get('/products/:id', controller.getProductById);

// Categories
router.get('/categories', controller.getCategories);
router.get('/categories/counts', controller.getCategoryCounts);

/* ──── Protected routes (require login + admin role) ─────────────── */

router.post('/products', authenticate, authorize('admin'), controller.createProduct);
router.put('/products/:id', authenticate, authorize('admin'), controller.updateProduct);
router.delete('/products/:id', authenticate, authorize('admin'), controller.deleteProduct);

module.exports = router;
