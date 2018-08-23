const firebase = require("../Firebase_CRUD");
const collection = "commands/";

module.exports = {
  listen: (callback, err) => {
    return firebase.listen_value(collection, callback, err);
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
  update: (actuatorId, data, callback) => {
    return firebase.update(collection, actuatorId, data, callback);
  },
  remove: (actuatorId, callback) => {
    return firebase.remove(collection, actuatorId, callback);
  }
};
