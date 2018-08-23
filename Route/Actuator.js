var express = require("express");
const router = express.Router();
const Actuator = require("../Database/Collection/Actuator");

router.get("/", function(req, res) {
  Actuator.getAll(data => {
    res.send(data.val());
  });
});

router.get("/:id", function(req, res) {
  Actuator.get(req.params.id, data => {
    res.send(data.val());
  });
});

router.post("/", function(req, res) {
  Actuator.write(req.body)
    .then(() => res.send({ result: "success" }))
    .catch(() => res.send({ result: "error" }));
});

router.delete("/:id", function(req, res) {
  Actuator.remove(req.params.id, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

router.put("/:id", function(req, res) {
  Actuator.update(req.params.id, req.body, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

module.exports = router;
