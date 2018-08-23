var express = require("express");
const router = express.Router();
const Behavior = require("../Database/Collection/Behavior");

router.get("/", function(req, res) {
  Behavior.getAll(data => {
    res.send(data.val());
  });
});

router.get("/:id", function(req, res) {
  Behavior.get(req.params.id, data => {
    res.send(data.val());
  });
});

router.post("/", function(req, res) {
  Behavior.write(req.body)
    .then(data => {
      res.send({ result: "success" });
    })
    .catch(err => {
      console.log(err);
      res.send({ result: "error" });
    });
});

router.delete("/:id", function(req, res) {
  Behavior.remove(req.params.id, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

router.put("/:id", function(req, res) {
  Behavior.update(req.params.id, req.body, err => {
    if (err) res.send({ result: "error" });
    else res.send({ result: "success" });
  });
});

module.exports = router;
