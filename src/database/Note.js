const DB = require('./db.json');
const { saveToDatabase } = require('./utils')

const DEFAULT_LIMIT = 10;

/*
   @openapi
   components:
     schemas:
       Note:
         type: object
         properties:
           id:
             type: string
             example: 61dbae02-c147-4e28-863c-db7bd402b2d6
           name:
             type: string
             example: Note Title
           content:
             type: string
             example: Note content 123
           createdAt:
             type: string
             example: 18.07.2024, 08:56:38
           updatedAt:
             type: string
             example: 18.07.2024, 08:56:38
*/

const getAllNotes = (filterParams, paginationParams, sort) => {
  try {
    let notes = DB.notes;
    if (filterParams.name) {
      return notes.filter(note => note.name
        .toLowerCase()
        .includes(filterParams.name.toLowerCase()));
    }
    if (paginationParams.limit) {
      return notes.slice(0, paginationParams.limit);
    }
    if (paginationParams.page) {
      const startIndex = (paginationParams.page - 1)   (paginationParams.limit || DEFAULT_LIMIT);
      const endIndex = startIndex + (paginationParams.limit || DEFAULT_LIMIT)
      return notes.slice(startIndex, endIndex)
    }
    // if (sort) {
    //   return notes.sort((a, b) => {
    //     if (sort === 'createdAt' || sort === 'updatedAt') {
    //       console.log(Date.parse(a[sort]), Date.parse(b[sort]));
    //       return Date.parse(a[sort]) - Date.parse(b[sort]);
    //     }
    //     return a[sort] - b[sort];
    //   });
    // }
    return notes;
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