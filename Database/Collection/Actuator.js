const firebase = require("../Firebase_CRUD");
const Command = require("./Command");
const collection = "actuators/";

module.exports = {
  listen_value: (callback, err) => {
    return firebase.listen_value(collection, callback, err);
  },
  listen: (callback, err) => {
    return firebase.listen_value(collection, callback, err);
  },
  getAll: (callback, err) => {
    return firebase.getAll(collection, callback, err);
  },
  get: (id, callback, err) => {
    return firebase.get(collection, id, callback, err);
  },
  write: data => {
    let promises = [];
    const id = firebase.write(collection, data).getKey();
    promises.push(id);
    if (data.commands) {
      for (uuid of Object.keys(data.commands)) {
        const newCommand = { ...data.commands[uuid] };
        newCommand.actuator = id;
        promises.push(Command.writeWithId(uuid, newCommand));
      }
    }
    return Promise.all(promises);
  },
  update: (actuatorId, data, callback) => {
    return firebase.update(collection, actuatorId, data, callback);
  },
  remove: (actuatorId, callback) => {
    return firebase.remove(collection, actuatorId, callback);
  },
  isConnected: actuator => {
    firebase.get(collection, actuator, data => {
      console.log(data.val());
    });
    return true;
  },
  execute: executable => {
    console.log("Execute => " + executable);
  }
};
