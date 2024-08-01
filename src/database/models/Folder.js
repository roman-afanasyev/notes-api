const pool = require('../dbPostgresql');

const getAllFolders = async () => {
  const result = await pool.query('SELECT * FROM folders f INNER JOIN notes n ON n.folder_id = f.id GROUP BY n.folder_id, f.id, n.id');

  return result.rows;
}

const getOneFolder = async (folderId) => {
  const result = await pool.query('SELECT * FROM folders WHERE id = $1', [folderId]);

  return result.rows[0];
}

const createNewFolder = async (newFolder) => {
  const { id, createdAt, updatedAt, name } = newFolder;
  const result = await pool.query(
    'INSERT INTO folders (name, id, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, id, createdAt, updatedAt]
  );

  return result.rows[0];
}

const updateOneFolder = async (folderId, changes) => {
  const { updatedAt, name } = changes;
  const result = await pool.query(
    'UPDATE folders SET name = $1, updated_at = $2 WHERE id = $3 RETURNING *',
    [name, updatedAt, folderId]
  )

  return result.rows[0];
}


const deleteOneFolder = async (folderId) => {
  return await pool.query('DELETE FROM folders WHERE id = $1', [folderId]);
}

module.exports = {
  getOneFolder,
  getAllFolders,
  createNewFolder,
  updateOneFolder,
  deleteOneFolder,
}