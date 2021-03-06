const express = require("express");
const Actuator = require("./Database/Collection/Actuator");
const Action_queue = require("./Database/Collection/Action_queue");
const Behavior = require("./Database/Collection/Behavior");
const Environment_variable = require("./Database/Collection/Environment_variable");
const ActuatorTCPServer = require("./ActuatorTCPServer");
const SensorTCPServer = require("./SensorTCPServer");
const SocketIO = require("./SocketIO");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const Logger = require("./Logger");
const cfg = require("./config.json");
const REST_PORT = cfg.REST_PORT;
const ACTUATOR_TCP_PORT = cfg.ACTUATOR_TCP_PORT;
const SENSOR_TCP_PORT = cfg.SENSOR_TCP_PORT;
const SOCKET_IO_PORT = cfg.SOCKET_IO_PORT;

app.get("/", function(req, res) {
  res.send("Hi there !");
});

app.use(cors());
app.use(bodyParser.json());
app.use("/", require("./router.js"));

app.listen(REST_PORT, "0.0.0.0", function() {
  Logger("Example app listening on port " + REST_PORT + " !");
});
ActuatorTCPServer.listen(ACTUATOR_TCP_PORT, "0.0.0.0", () =>
  Logger("TCP actuator server listening on port " + ACTUATOR_TCP_PORT + " !")
);
SensorTCPServer.listen(SENSOR_TCP_PORT, "0.0.0.0", () =>
  Logger("TCP sensor server listening on port " + SENSOR_TCP_PORT + " !")
);

SocketIO.listen(SOCKET_IO_PORT);
Logger("Socket IO listening on port " + SOCKET_IO_PORT + " !");

function checkFirebaseData(data) {
  if (data) {
    const value = data.val();
    if (value) {
      return value;
    }
  }
  return undefined;
}

Environment_variable.listen_change(data => {
  if ((value = checkFirebaseData(data))) {
    Logger(`A variable has been updated !`);
    let behaviors = value.behaviors;
    if (behaviors) {
      for (id of behaviors) {
        Behavior.get(id, behavior => {
          behavior = behavior.val();
          if (behavior) {
            Behavior.checkBehavior(behavior.evaluable).then(res => {
              if (res == true) {
                Action_queue.write(behavior.action);
              }
            });
          }
        });
      }
    }
  }
});
