const firebase = require("../Firebase_CRUD");
const collection = "action_queue/";

module.exports = {
  listen: (callback, err) => {
    return firebase.listen_child_added(collection, callback, err);
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
  update: (actionId, data, callback) => {
    return firebase.update(collection, actionId, data, callback);
  },
  remove: (actionId, callback) => {
    return firebase.remove(collection, actionId, callback);
  }
};
