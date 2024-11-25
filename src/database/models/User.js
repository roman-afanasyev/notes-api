const pool = require('../dbPostgresql');

const getUser = async (userId) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

  return result.rows[0];
}

const createNewUser = async (newUser) => {
  const { id, name, email, photo } = newUser;
  const result = await pool.query(
    'INSERT INTO users (id, name, email, photo) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, name, email, photo]
  );

  return result.rows[0];
}

module.exports = {
  getUser,
  createNewUser,
}
