log = function(message) {
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  console.log(`${h}:${m} --> ${message}`);
};
module.exports = log;
