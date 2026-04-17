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

const getOrdersByUserId = async (userId) => {
  const { rows } = await pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC',
    [userId]
  );
  return rows;
};

/**
 * Get all orders along with their items and associated product info (admin only).
 */
const getAllOrders = async () => {
  const { rows } = await pool.query(`
    SELECT 
      o.id,
      o.total,
      o.shipping_info,
      o.status,
      o.created_at,
      u.name as customer_name,
      u.email as customer_email,
      json_agg(
        json_build_object(
          'product_id', i.product_id,
          'quantity', i.quantity,
          'price', i.price,
          'product_name', p.name,
          'product_image', p.image_key
        )
      ) as items
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items i ON o.id = i.order_id
    LEFT JOIN products p ON i.product_id = p.id
    GROUP BY o.id, u.name, u.email
    ORDER BY o.created_at DESC
  `);
  return rows;
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getAllOrders,
};
