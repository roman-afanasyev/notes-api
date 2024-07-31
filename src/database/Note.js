const pool = require('./dbPostgresql');

const getAllNotes = async () => {
  const result = await pool.query('SELECT * FROM notes');

  return result.rows;
}

const getOneNote = async (noteId) => {
  const result = await pool.query('SELECT * FROM notes WHERE id = $1', [noteId]);

  return result.rows[0];
}

const createNewNote = async (newNote) => {
  const { id, createdAt, updatedAt, name, content } = newNote;
  const result = await pool.query(
    'INSERT INTO notes (name, content, id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, content, id, createdAt, updatedAt]
  );

  return result.rows[0];
}

const updateOneNote = async (noteId, changes) => {
  const { updatedAt, name, content } = changes;
  const result = await pool.query(
    'UPDATE notes SET name = $1, content = $2, updated_at = $3 WHERE id = $4 RETURNING *',
    [name, content, updatedAt, noteId]
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