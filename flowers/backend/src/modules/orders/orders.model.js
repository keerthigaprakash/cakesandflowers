/**
 * orders.model.js
 * ───────────────
 * Data‑access layer for order management.
 */

const { pool } = require('../../config/db');

/**
 * Creates a new order and its associated items in a single transaction.
 */
const createOrder = async ({ user_id, total, items, shipping_info }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create the order entry
    // Note: We might want to store shipping_info as a JSONB column in 'orders' 
    // or in a separate 'shipping_details' table. 
    // For now, we'll stick to the existing schema.
    const orderRes = await client.query(
      'INSERT INTO orders (user_id, total, shipping_info, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id || null, total, shipping_info || null, 'pending']
    );
    const order = orderRes.rows[0];

    // Create the order items
    // If product_id is not in our 'products' table (e.g. static frontend products), 
    // we might have a problem because of the FOREIGN KEY constraint. 
    // We should probably ensure products exist or allow product_id to be null.
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id || null, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get orders for a specific user.
 */
const getOrdersByUserId = async (userId) => {
  const { rows } = await pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC',
    [userId]
  );
  return rows;
};

module.exports = {
  createOrder,
  getOrdersByUserId,
};
