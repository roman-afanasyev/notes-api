const express = require('express');
const router = express.Router();
const {
  getAllNotes,
  getOneNote,
  deleteOneNote,
  updateOneNote,
  createNewNote
}  = require('../controllers/noteController');

router.get('/', getAllNotes);

router.get('/:noteId', getOneNote);

router.post('/', createNewNote);

router.patch('/:noteId', updateOneNote);

router.delete('/:noteId', deleteOneNote);

module.exports = router;