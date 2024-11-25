const { v4: uuid } = require('uuid');
const User = require('../../database/models/User')

const getOneUser = (userId) => {
  try {
    return User.getUser(userId);
  } catch (e) {
    throw e;
  }
}

const createNewUser = (newUser) => {
  try {
    return User.createNewUser(newUser);
  } catch (e) {
    throw e;
  }
}

module.exports = {
  getOneUser,
  createNewUser,
}
