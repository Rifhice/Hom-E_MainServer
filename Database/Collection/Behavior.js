const firebase = require("../Firebase_CRUD");
const Environment_variable = require("./Environment_variable");
const collection = "behaviors/";

function checkEval(eval) {
  if (eval.type === "expression") {
    return checkExpression(eval);
  } else if (eval.type === "block") {
    return checkBlock(eval);
  }
}
function checkExpression(expression) {
  const operator = expression.operator;
  let first = expression.evaluable[0];
  let second = expression.evaluable[1];
  return new Promise(function(resolve, reject) {
    checkEval(first).then(resultFirst => {
      checkEval(second).then(resultSecond => {
        if (operator == "&&") {
          resolve(resultFirst && resultSecond);
        } else {
          resolve(resultFirst || resultSecond);
        }
      });
    });
  });
}

function checkBlock(block) {
  return new Promise(function(resolve, reject) {
    Environment_variable.get(block.variable, data => {
      if (data) {
        const variable = data.val();
        if (variable) {
          const current_value = variable.value.current_value;
          const value = block.value;
          switch (block.operator) {
            case "==":
              resolve(value === current_value);
              break;
            case "!=":
              resolve(value !== current_value);
              break;
            case "<=":
              resolve(current_value <= value);
              break;
            case ">=":
              resolve(current_value >= value);
              break;
            case "<":
              resolve(current_value < value);
              break;
            case ">":
              resolve(current_value > value);
              break;
          }
        }
      }
    });
  });
}

function extractEnvironmentVariableFromEvaluableBis(evaluable, state) {
  if (evaluable.type === "expression") {
    state = extractEnvironmentVariableFromEvaluableBis(
      evaluable.evaluable[0],
      extractEnvironmentVariableFromEvaluableBis(evaluable.evaluable[1], state)
    );
  } else if (evaluable.type === "block") {
    state.push(evaluable.variable);
  }
  return state;
}

function extractEnvironmentVariable(behavior) {
  return extractEnvironmentVariableFromEvaluableBis(behavior.evaluable, []);
}
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
    let variables = extractEnvironmentVariable(data);
    for (let variable of variables) {
      Environment_variable.get(variable, data => {
        data = data.val();
        if (data) {
          data.behaviors = data.behaviors || [];
          if (!data.behaviors.includes(id)) {
            data.behaviors.push(id);
            promises.push(Environment_variable.update(variable, data));
          }
        }
      });
    }
    return Promise.all(promises);
  },
  update: (behaviorId, data, callback) => {
    return firebase.update(collection, behaviorId, data, callback);
  },
  remove: (behaviorId, callback) => {
    return firebase.remove(collection, behaviorId, callback);
  },
  checkBehavior(behavior) {
    return checkEval(behavior);
  }
};
