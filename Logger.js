log = function(message) {
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  console.log(`${h}:${m} --> ${message}`);
};
module.exports = log;
