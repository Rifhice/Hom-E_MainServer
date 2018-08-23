const firebase = require("../Firebase_CRUD");
const collection = "environment_variables/";

module.exports = {
  listen_change: (callback, err) => {
    return firebase.listen_change(collection, callback, err);
  },
  getAll: (callback, err) => {
    return firebase.getAll(collection, callback, err);
  },
  get: (id, callback, err) => {
    return firebase.get(collection, id, callback, err);
  },
  write: (data, callback) => {
    return firebase.write(collection, data, callback);
  },
  writeWithId: (id, data, callback) => {
    return firebase.writeWithId(collection + id, data, callback);
  },
  update: (variableId, data, callback) => {
    return firebase.update(collection, variableId, data, callback);
  },
  remove: (variableId, callback) => {
    return firebase.remove(collection, variableId, callback);
  }
};
