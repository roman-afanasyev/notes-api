const pool = require('../dbPostgresql');

const getAllNotes = async (userId) => {
  const result = await pool.query('SELECT * FROM notes WHERE user_id = $1', [userId]);

  return result.rows;
}

const getOneNote = async (noteId) => {
  const result = await pool.query('SELECT * FROM notes WHERE id = $1', [noteId]);

  return result.rows[0];
}

const createNewNote = async (newNote) => {
  const { id, createdAt, updatedAt, title, content, folderId, userId } = newNote;
  const result = await pool.query(
    'INSERT INTO notes (title, content, id, created_at, updated_at, folder_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [title, content, id, createdAt, updatedAt, folderId, userId]
  );

  return result.rows[0];
}

const updateOneNote = async (noteId, changes) => {
  const { updatedAt, title, content, folderId } = changes;
  const result = await pool.query(
    'UPDATE notes SET title = $1, content = $2, updated_at = $3, folder_id = $4 WHERE id = $5 RETURNING *',
    [title, content, updatedAt, folderId, noteId]
  )

  return result.rows[0];
}


const deleteOneNote = async (noteId) => {
  return await pool.query('DELETE FROM notes WHERE id = $1', [noteId]);
}

module.exports = {
  getOneNote,
  getAllNotes,
  createNewNote,
  updateOneNote,
  deleteOneNote,
}