var express = require("express");
const router = express.Router();
const Complex_command = require("../Database/Collection/Complex_command");

router.get("/", function(req, res) {
  Complex_command.getAll(data => {
    res.send(data.val());
  });
});

router.get("/:id", function(req, res) {
  Complex_command.get(req.params.id, data => {
    res.send(data.val());
  });
});

router.post("/", function(req, res) {
  Complex_command.write(req.body, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

router.delete("/:id", function(req, res) {
  Complex_command.remove(req.params.id, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

router.put("/:id", function(req, res) {
  Complex_command.update(req.params.id, req.body, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

module.exports = router;
