const firebase = require("../Firebase_CRUD");
const collection = "sensors/";
const Environment_variable = require("./Environment_variable");

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
  write: (data, callback) => {
    let promises = [];
    const id = firebase.write(collection, data).getKey();
    promises.push(id);
    if (data.environment_variables) {
      for (uuid of Object.keys(data.environment_variables)) {
        const newVariable = { ...data.environment_variables[uuid] };
        newVariable.sensor = id;
        newVariable.behaviors = [];
        promises.push(Environment_variable.writeWithId(uuid, newVariable));
      }
    }
    return Promise.all(promises);
  },
  update: (sensorId, data, callback) => {
    return firebase.update(collection, sensorId, data, callback);
  },
  remove: (sensorId, callback) => {
    return firebase.remove(collection, sensorId, callback);
  },
  updateVariable: (sensorId, variableId, value, callback) => {
    promises = [];
    promises.push(
      firebase.update(
        collection + sensorId + "/environment_variables/",
        variableId + "/value/current_value",
        value
      )
    );
    promises.push(
      firebase.update(
        "/environment_variables/",
        variableId + "/value/current_value",
        value
      )
    );
    return Promise.all(promises);
  }
};
