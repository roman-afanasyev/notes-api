const noteService = require('../services/noteService');

const getAllNotes = async (req, res) => {
  const { name, limit, page, sort } = req.query;

  try {
    const allNotes = await noteService.getAllNotes({ name }, { limit, page }, sort);
    res.send({ status: 200, data: allNotes });
  } catch (e) {
    res.status(e?.status || 500).send({
      status: 'FAILED',
      data: { error: e?.message || e },
    });
  }
};

const getOneNote = async (req, res) => {
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
    const note = await noteService.getOneNote(noteId);
    res.send({ status: 'OK', data: note });
  } catch (e) {
    res.status(e?.status || 500).send({
      status: 'FAILED',
      data: { error: e?.message || e },
    });
  }
};

const createNewNote = async (req, res) => {
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
    folderId: body.folderId,
  }

  try {
    const createdNote = await noteService.createNewNote(newNote);

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

const updateOneNote = async (req, res) => {
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
  console.log('body', body);
  try {
    const updatedNote = await noteService.updateOneNote(
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

const deleteOneNote = async (req, res) => {
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
    await noteService.deleteOneNote(noteId);
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