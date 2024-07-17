const noteService = require('../services/noteService');

const getAllNotes = (req, res) => {
  try {
    const allNotes = noteService.getAllNotes();
    res.send({ status: 200, data: allNotes });
  } catch (e) {
    res.status(e?.status || 500).send({
      status: 'FAILED',
      data: { error: e?.message || e },
    });
  }
};

const getOneNote = (req, res) => {
  const {
    params: { noteId },
  } = req;
  if (!noteId) {
    res.status(400).send({
      status: 'FAILED',
      data: {
        error:
          "Параметр ':noteId' не может быть пустым",
      },
    });
  }

  try {
    const note = noteService.getOneNote(noteId);
    res.send({ status: 'OK', data: note });
  } catch (e) {
    res.status(e?.status || 500).send({
      status: 'FAILED',
      data: { error: e?.message || e },
    });
  }
};

const createNewNote = (req, res) => {
  const { body } = req;

  if (!body.name) {
    res.status(400).send({
      status: 'FAILED',
      data: {
        error:
          'Отсутствует поле "name"',
      },
    });
  }

  const newNote = {
    name: body.name,
    content: body.content || '',
  }

  try {
    const createdNote = noteService.createNewNote(newNote);

    res.status(201).send({
      status: 'OK',
      data: createdNote,
    });
  } catch (e) {
    res.status(e?.status || 500).send({
      status: 'FAILED',
      data: { error: e?.message || e },
    });
  }

};

const updateOneNote = (req, res) => {
  const {
    body,
    params: { noteId },
  } = req;
  if (!noteId) {
    res.status(400).send({
      status: 'FAILED',
      data: {
        error:
          "Параметр ':noteId' не может быть пустым",
      },
    });
  }
  try {
    const updatedNote = noteService.updateOneNote(
      noteId,
      body
    );
    res.send({ status: 'OK', data: updatedNote });
  } catch (e) {
    res.status(e?.status || 500).send({
      status: 'FAILED',
      data: { error: e?.message || e },
    });
  }
};

const deleteOneNote = (req, res) => {
  const {
    params: { noteId },
  } = req;
  if (!noteId) {
    res.status(400).send({
      status: 'FAILED',
      data: {
        error:
          "Параметр ':noteId' не может быть пустым",
      },
    });
  }
  try {
    noteService.deleteOneNote(noteId);
    res.status(204).send({ status: 'OK' });
  } catch (e) {
    res.status(e?.status || 500).send({
      status: 'FAILED',
      data: { error: e?.message || e },
    });
  }
};

module.exports = {
  getAllNotes,
  getOneNote,
  createNewNote,
  updateOneNote,
  deleteOneNote,
};