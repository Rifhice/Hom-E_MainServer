var express = require("express");
const router = express.Router();
const Command = require("../Database/Collection/Command");

router.get("/", function(req, res) {
  Command.getAll(data => {
    res.send(data.val());
  });
});

router.get("/:id", function(req, res) {
  Command.get(req.params.id, data => {
    res.send(data.val());
  });
});

router.post("/", function(req, res) {
  Command.write(req.body, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

router.delete("/:id", function(req, res) {
  Command.remove(req.params.id, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

router.put("/:id", function(req, res) {
  Command.update(req.params.id, req.body, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

module.exports = router;
