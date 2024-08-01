const { v4: uuid } = require('uuid');
const Folder = require('../../database/models/folder');

const getAllFolders = (filterParams, paginationParams, sort) => {
  try {
    return Folder.getAllFolders(filterParams, paginationParams, sort);
  } catch (e) {
    throw e;
  }
}

const getOneFolder = (folderId) => {
  try {
    return Folder.getOneFolder(folderId);
  } catch (e) {
    throw e;
  }
}

const createNewFolder = (newFolder) => {
  const folderToInsert= {
    ...newFolder,
    id: uuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  try {
    return Folder.createNewFolder(folderToInsert);
  } catch (e) {
    throw e;
  }
}

const updateOneFolder = (folderId, changes) => {
  const updatedFolder = {
    ...changes,
    updatedAt: new Date().toISOString(),
  }
  try {
    return Folder.updateOneFolder(
      folderId,
      updatedFolder,
    );
  } catch (e) {
    throw e;
  }
}

const deleteOneFolder = (folderId) => {
  try {
    Folder.deleteOneFolder(folderId)
  } catch (e) {
    throw e;
  }
}

module.exports = {
  getAllFolders,
  getOneFolder,
  createNewFolder,
  updateOneFolder,
  deleteOneFolder,
}