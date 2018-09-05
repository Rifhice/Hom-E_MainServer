var net = require("net");
var JsonSocket = require("json-socket");
const Actuator = require("./Database/Collection/Actuator");
const Action_queue = require("./Database/Collection/Action_queue");
const Logger = require("./Logger");

var server = net.createServer();

var clients = [];

function checkAllAction() {
  Logger("Checking all the existing actions !");
  Action_queue.getAll(data => {
    if (data) {
      const actions = data.val();
      for (let key in actions) {
        if (actions[key]) {
          let actuator = actions[key].actuator;
          executeAction(actuator, key, actions[key]);
        }
      }
    }
  });
}

function executeAction(actuatorId, actionKey, action) {
  Actuator.get(actuatorId, data => {
    if (data) {
      data = data.val();
      if (data && data.isConnected) {
        for (let clientKey in clients) {
          client = clients[clientKey];
          if (client[0] === actuatorId) {
            let mess =
              data.commands[action.command].key +
              " " +
              action.arguments.join(" ");
            action.arguments.forEach((arg, i) => {
              data.commands[action.command].command_arguments[i].current = arg;
            });
            client[2].sendMessage({
              action: "execute",
              executable: mess,
              actuatorId: actuatorId,
              data: data,
              actionKey: actionKey
            });
            Logger(`Action ${actionKey} execution sent.`);
          }
        }
      } else {
        Logger("The actuator is unreachable !");
      }
    }
  });
}

server.on("connection", function(socket) {
  socket = new JsonSocket(socket);
  Logger("New actuator connected !");
  socket.on("message", function(message) {
    if (message) {
      switch (message.action) {
        case "registration":
          message.data.isConnected = true;
          Actuator.write(message.data)
            .then(data => {
              clients.push([data[0], message.data, socket]);
              socket.sendMessage({
                action: "registration",
                result: "success",
                id: data[0]
              });
              Logger("Actuator " + data[0] + " succesfully registered !");
              checkAllAction();
            })
            .catch(err => {
              console.log(err);
            });
          break;
        case "connection":
          let id = message.data[0];
          message.data[1].isConnected = true;
          Actuator.get(id, data => {
            if (!data.val()) {
              Actuator.write(message.data[1])
                .then(data => {
                  clients.push([data[0], message.data, socket]);
                  socket.sendMessage({
                    action: "registration",
                    result: "success",
                    id: data[0]
                  });
                  Logger("Actuator " + data[0] + " succesfully registered !");
                  checkAllAction();
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              Actuator.update(id, message.data[1])
                .then(data => {
                  clients.push([message.data[0], message.data[1], socket]);
                  socket.sendMessage({
                    action: "connection",
                    result: "success"
                  });
                  Logger(
                    "Actuator " + message.data[0] + " succesfully connected !"
                  );
                  checkAllAction();
                })
                .catch(err => console.log(err));
            }
          });
          break;
        case "disconnection":
          let data = clients[socket];
          if (data) {
            let id = data[0];
            let actuator = data[1];
            actuator.isConnected = false;
            Actuator.update(id, actuator, () => {
              socket.sendMessage({
                action: "disconnection",
                result: "success"
              });
            });
            Logger("Actuator " + id + " just disconnected");
          }
          break;
        case "execute":
          if (message.result === "success") {
            Actuator.update(message.actuatorId, message.data);
            Action_queue.remove(message.actionKey);
          } else {
            Logger("Error while executing an action !");
          }
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
      Actuator.update(id, actuator);
      Logger("Actuator " + id + " just disconnected");
    }
  });
});

Action_queue.listen(data => {
  if (data) {
    const action = data.val();
    let key = data.key;
    if (action) {
      let actuator = action.actuator;
      executeAction(actuator, key, action);
    }
  }
});

module.exports = server;
