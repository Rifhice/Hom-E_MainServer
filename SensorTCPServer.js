var net = require("net");
var JsonSocket = require("json-socket");
const Sensor = require("./Database/Collection/Sensor");
const Logger = require("./Logger");
var server = net.createServer();

var clients = [];

server.on("connection", function(socket) {
  socket = new JsonSocket(socket);
  Logger("New Sensor connected !");
  socket.on("message", function(message) {
    if (message) {
      switch (message.action) {
        case "registration":
          message.data.isConnected = true;
          Sensor.write(message.data)
            .then(data => {
              clients[socket] = [data[0], message.data, socket];
              socket.sendMessage({
                action: "registration",
                result: "success",
                id: data[0]
              });
              Logger("Sensor " + data[0] + " succesfully registered !");
            })
            .catch(err => {
              console.log(err);
            });
          break;
        case "connection":
          let id = message.data[0];
          message.data[1].isConnected = true;
          Sensor.get(id, data => {
            if (!data.val()) {
              Sensor.write(message.data[1])
                .then(data => {
                  clients[socket] = [data[0], message.data, socket];
                  socket.sendMessage({
                    action: "registration",
                    result: "success",
                    id: data[0]
                  });
                  Logger("Sensor " + data[0] + " succesfully registered !");
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              Sensor.update(id, message.data[1])
                .then(data => {
                  clients[socket] = [message.data[0], message.data[1], socket];
                  socket.sendMessage({
                    action: "connection",
                    result: "success"
                  });
                  Logger(
                    "Sensor " + message.data[0] + " succesfully connected !"
                  );
                })
                .catch(err => console.log(err));
            }
          });
          break;
        case "updateVariable":
          let sensor = message.data.sensor;
          let variable = message.data.variable;
          let value = message.data.value;
          Sensor.updateVariable(sensor, variable, value).then(data => {
            Logger("Updated !");
          });
          break;
        default:
          socket.sendMessage({ action: "unknown" });
          break;
      }
    }
  });

  socket.on("end", function() {
    let data = clients[socket];
    if (data) {
      let id = data[0];
      let actuator = data[1];
      actuator.isConnected = false;
      Sensor.update(id, actuator);
      Logger("Sensor " + id + " just disconnected");
    }
  });
});

module.exports = server;
