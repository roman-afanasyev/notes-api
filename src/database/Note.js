const DB = require('./db.json');
const { saveToDatabase } = require('./utils')

const getAllNotes = () => {
  try {
    return DB.notes;
  } catch (e) {
    throw { status: 500, message: e };
  }
}

const getOneNote = (noteId) => {
  try {
    const note = DB.notes.find(
      (note) => note.id === noteId
    );
    if (!note) {
      throw {
        status: 400,
        message: `Не удалось найти заметку с id '${noteId}'`,
      };
    }
    return note;
  } catch (e) {
    throw {
      status: e?.status || 500,
      message: e?.message || e,
    };
  }

}

const createNewNote = (newNote) => {
  try {
    const isAlreadyAdded = DB.notes?.findIndex(note => note.name === newNote.name) > -1;

    if (isAlreadyAdded) {
      throw {
        status: 400,
        message: `Заметка с именем '${newNote.name}' уже существует`,
      };
    }

    DB.notes.push(newNote);
    saveToDatabase(DB);
    return newNote;
  } catch (e) {
    throw {
      status: 500,
      message: e?.message || e,
    }
  }
}

const updateOneNote = (noteId, changes) => {
  try {
    const indexForUpdate = DB.notes.findIndex(
      (note) => note.id === noteId
    );
    if (indexForUpdate === -1) {
      throw {
        status: 400,
        message: `Не удалось найти заметку с id '${noteId}'`,
      };
    }
    const updatedNote = {
      ...DB.notes[indexForUpdate],
      ...changes,
      updatedAt: new Date().toLocaleString('ru-RU', {
        timeZone: 'UTC',
      }),
    };
    DB.notes[indexForUpdate] = updatedNote;
    saveToDatabase(DB);
    return updatedNote;
  } catch (e) {
    throw {
      status: e?.status || 500,
      message: e?.message || e,
    };
  }
}


const deleteOneNote = (noteId) => {
  try {
    const indexForDeletion = DB.notes.findIndex(
      (note) => note.id === noteId
    );
    if (indexForDeletion === -1) {
      throw {
        status: 400,
        message: `Не удалось найти заметку с id '${noteId}'`,
      };
    }
    DB.notes.splice(indexForDeletion, 1);
    saveToDatabase(DB);
  } catch (e) {
    throw {
      status: e?.status || 500,
      message: e?.message || e,
    };
  }
}

module.exports = {
  getOneNote,
  getAllNotes,
  createNewNote,
  updateOneNote,
  deleteOneNote,
}