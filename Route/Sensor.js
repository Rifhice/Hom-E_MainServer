var express = require("express");
const router = express.Router();
const Sensor = require("../Database/Collection/Sensor");

router.get("/", function(req, res) {
  Sensor.getAll(data => {
    res.send(data.val());
  });
});

router.get("/:id", function(req, res) {
  Sensor.get(req.params.id, data => {
    res.send(data.val());
  });
});

router.post("/", function(req, res) {
  Sensor.write(req.body, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

router.delete("/:id", function(req, res) {
  Sensor.remove(req.params.id, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

router.put("/:id", function(req, res) {
  Sensor.update(req.params.id, req.body, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

module.exports = router;
