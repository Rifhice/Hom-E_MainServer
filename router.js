var express = require("express");

const router = express.Router();

router.use("/Actuator", require("./Route/Actuator"));
router.use("/Behavior", require("./Route/Behavior"));
router.use("/Sensor", require("./Route/Sensor"));
router.use("/Action_queue", require("./Route/Action_queue"));
router.use("/Command", require("./Route/Command"));
router.use("/EnvironmentVariable", require("./Route/EnvironmentVariable"));
//router.use("/ComplexCommand", require("./Route/ComplexCommand"));

module.exports = router;
