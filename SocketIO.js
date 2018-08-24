var io = require("socket.io")();
const Action_queue = require("./Database/Collection/Action_queue");
const Actuator = require("./Database/Collection/Actuator");
const Sensor = require("./Database/Collection/Sensor");
const Environment_variable = require("./Database/Collection/Environment_variable");
const Command = require("./Database/Collection/Command");
const Behavior = require("./Database/Collection/Behavior");

io.on("connection", function(client) {
  console.log("New UI connected");
  client.on("disconnect", function() {
    console.log("UI disconnected");
  });
  client.on("register action_queue", function(msg) {
    Action_queue.listen_value(data => {
      io.emit("action_queue", data);
    });
  });
  client.on("register actuator", function(msg) {
    Actuator.listen_value(data => {
      io.emit("actuator", data);
    });
  });
  client.on("register sensor", function(msg) {
    Sensor.listen_value(data => {
      io.emit("sensor", data);
    });
  });
  client.on("register command", function(msg) {
    Command.listen_value(data => {
      io.emit("command", data);
    });
  });
  client.on("register behavior", function(msg) {
    Behavior.listen_value(data => {
      io.emit("behavior", data);
    });
  });
  client.on("register environment_variable", function(msg) {
    Environment_variable.listen_value(data => {
      io.emit("environment_variable", data);
    });
  });
});

module.exports = io;
