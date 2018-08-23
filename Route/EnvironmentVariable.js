var express = require("express");
const router = express.Router();
const Environment_variable = require("../Database/Collection/Environment_variable");

router.get("/", function(req, res) {
  Environment_variable.getAll(data => {
    res.send(data.val());
  });
});

router.get("/:id", function(req, res) {
  Environment_variable.get(req.params.id, data => {
    res.send(data.val());
  });
});

router.post("/", function(req, res) {
  Environment_variable.write(req.body, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

router.delete("/:id", function(req, res) {
  Environment_variable.remove(req.params.id, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

router.put("/:id", function(req, res) {
  Environment_variable.update(req.params.id, req.body, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

module.exports = router;
