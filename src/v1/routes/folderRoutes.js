const express = require('express');
const apicache = require('apicache');

const {
  getAllFolders,
  getOneFolder,
  deleteOneFolder,
  updateOneFolder,
  createNewFolder
}  = require('../controllers/folderController');

const router = express.Router();
const cache = apicache.middleware;

router.get('/', getAllFolders);

router.get('/:folderId', getOneFolder);

router.post('/', createNewFolder);

router.patch('/:folderId', updateOneFolder);

router.delete('/:folderId', deleteOneFolder);

module.exports = router;