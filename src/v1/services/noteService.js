const { v4: uuid } = require('uuid');
const Note = require('../../database/Note')

const getAllNotes = (filterParams, paginationParams, sort) => {
  try {
    return Note.getAllNotes(filterParams, paginationParams, sort);
  } catch (e) {
    throw e;
  }
}

const getOneNote = (noteId) => {
  try {
    return Note.getOneNote(noteId);
  } catch (e) {
    throw e;
  }
}

const createNewNote = (newNote) => {
  const noteToInsert= {
    ...newNote,
    id: uuid(),
    createdAt: new Date().toLocaleString('ru-RU', { timeZone: 'UTC' }),
    updatedAt: new Date().toLocaleString('ru-RU', { timeZone: 'UTC' })
  }

  try {
    return Note.createNewNote(noteToInsert);
  } catch (e) {
    throw e;
  }
}

const updateOneNote = (noteId, changes) => {

  try {
    return Note.updateOneNote(
      noteId,
      changes
    );
  } catch (e) {
    throw e;
  }
}

const deleteOneNote = (noteId) => {
  try {
    Note.deleteOneNote(noteId)
  } catch (e) {
    throw e;
  }
}

module.exports = {
  getAllNotes,
  getOneNote,
  createNewNote,
  updateOneNote,
  deleteOneNote,
}