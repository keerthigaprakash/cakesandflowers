/**
 * home.model.js
 * ─────────────
 * Data‑access layer – all raw SQL queries for the Home module live here.
 * Uses the shared connection pool from config/db.js.
 */

const { pool } = require('../../config/db');

/* ────────────────────────────── Products ────────────────────────────── */

const getAllProducts = async (category) => {
  let query = 'SELECT *, image_key AS image FROM products';
  const params = [];

  if (category && category !== 'all') {
    query += ' WHERE category = $1';
    params.push(category);
  }

  query += ' ORDER BY id ASC';
  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Retrieve featured products (latest 12 items).
 */
const getFeaturedProducts = async () => {
  const { rows } = await pool.query(
    'SELECT *, image_key AS image FROM products ORDER BY created_at DESC LIMIT 12'
  );
  return rows;
};

/**
 * Retrieve a single product by its ID.
 */
const getProductById = async (id) => {
  const { rows } = await pool.query('SELECT *, image_key AS image FROM products WHERE id = $1', [id]);
  return rows[0] || null;
};

/**
 * Insert a new product.
 */
const createProduct = async ({ name, price, category, description, image_key, features }) => {
  const { rows } = await pool.query(
    `INSERT INTO products (name, price, category, description, image_key, features)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, price, category, description || '', image_key || '', features || []]
  );
  return rows[0];
};

/**
 * Update an existing product (partial update supported).
 */
const updateProduct = async (id, fields) => {
  const allowed = ['name', 'price', 'category', 'description', 'image_key', 'features', 'in_stock'];
  const setClauses = [];
  const values = [];
  let idx = 1;

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      setClauses.push(`${key} = $${idx}`);
      values.push(fields[key]);
      idx++;
    }
  }

  if (setClauses.length === 0) return getProductById(id);

  setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE products SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0] || null;
};

/**
 * Delete a product by ID.
 */
const deleteProduct = async (id) => {
  const { rows } = await pool.query(
    'DELETE FROM products WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
};

/**
 * Get distinct categories.
 */
const getCategories = async () => {
  const { rows } = await pool.query(
    'SELECT DISTINCT category FROM products ORDER BY category'
  );
  return rows.map((r) => r.category);
};

/**
 * Get product count per category.
 */
const getCategoryCounts = async () => {
  const { rows } = await pool.query(
    'SELECT category, COUNT(*)::int AS count FROM products GROUP BY category ORDER BY category'
  );
  return rows;
};

/* ────────────────────────────── Users ───────────────────────────────── */

/**
 * Find a user by email.
 */
const findUserByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
};

/**
 * Create a new user.
 */
const createUser = async ({ name, email, password, role }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, password, role || 'customer']
  );
  return rows[0];
};

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getCategoryCounts,
  findUserByEmail,
  createUser,
};
