const folderService = require('../services/folderService');

const getAllFolders = async (req, res) => {
  const { name, limit, page, sort } = req.query;

  try {
    const allFolders = await folderService.getAllFolders({ name }, { limit, page }, sort);
    res.send({ status: 200, data: allFolders });
  } catch (e) {
    res.status(e?.status || 500).send({
      status: 'FAILED',
      data: { error: e?.message || e },
    });
  }
};

const getOneFolder = async (req, res) => {
  const {
    params: { folderId },
  } = req;
  if (!folderId) {
    res.status(400).send({
      status: 'FAILED',
      data: {
        error:
          "Параметр ':folderId' не может быть пустым",
      },
    });
  }

  try {
    const folder = await folderService.getOneFolder(folderId);
    res.send({ status: 'OK', data: folder });
  } catch (e) {
    res.status(e?.status || 500).send({
      status: 'FAILED',
      data: { error: e?.message || e },
    });
  }
};

const createNewFolder = async (req, res) => {
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

  const newFolder = {
    name: body.name,
    content: body.content || '',
  }

  try {
    const createdFolder = await folderService.createNewFolder(newFolder);

    res.status(201).send({
      status: 'OK',
      data: createdFolder,
    });
  } catch (e) {
    res.status(e?.status || 500).send({
      status: 'FAILED',
      data: { error: e?.message || e },
    });
  }

};

const updateOneFolder = async (req, res) => {
  const {
    body,
    params: { folderId },
  } = req;
  if (!folderId) {
    res.status(400).send({
      status: 'FAILED',
      data: {
        error:
          "Параметр ':folderId' не может быть пустым",
      },
    });
  }
  console.log('body', body);
  try {
    const updatedFolder = await folderService.updateOneFolder(
      folderId,
      body
    );
    res.send({ status: 'OK', data: updatedFolder });
  } catch (e) {
    res.status(e?.status || 500).send({
      status: 'FAILED',
      data: { error: e?.message || e },
    });
  }
};

const deleteOneFolder = async (req, res) => {
  const {
    params: { folderId },
  } = req;
  if (!folderId) {
    res.status(400).send({
      status: 'FAILED',
      data: {
        error:
          "Параметр ':folderId' не может быть пустым",
      },
    });
  }
  try {
    await folderService.deleteOneFolder(folderId);
    res.status(204).send({ status: 'OK' });
  } catch (e) {
    res.status(e?.status || 500).send({
      status: 'FAILED',
      data: { error: e?.message || e },
    });
  }
};

module.exports = {
  getAllFolders,
  getOneFolder,
  createNewFolder,
  updateOneFolder,
  deleteOneFolder,
};