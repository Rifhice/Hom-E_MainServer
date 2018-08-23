const DB = require("./DB_connection");

module.exports = {
  listen_value: (collection, callback, err) => {
    return DB.ref(collection).on("value", callback, err);
  },
  listen_change: (collection, callback, err) => {
    return DB.ref(collection).on("child_changed", callback, err);
  },
  listen_child_added: (collection, callback, err) => {
    return DB.ref(collection).on("child_added", callback, err);
  },
  getAll: (collection, callback, err) => {
    return DB.ref(collection).once("value", callback, err);
  },
  get: (collection, id, callback, err) => {
    return DB.ref(collection + id).once("value", callback, err);
  },
  write: (collection, data, callback) => {
    return DB.ref(collection).push(data, callback);
  },
  writeWithId: (collection, data, callback) => {
    return DB.ref(collection).set(data, callback);
  },
  update: (collection, actuatorId, data, callback) => {
    return DB.ref(collection + actuatorId).set(data, callback);
  },
  remove: (collection, actuatorId, callback) => {
    return DB.ref(collection + actuatorId).set(null, callback);
  }
};
