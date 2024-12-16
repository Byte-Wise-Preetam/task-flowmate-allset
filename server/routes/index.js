const express = require("express");
const userRoutes = require("./userRoutes");
const tasksRoutes = require("./tasksRoutes");

const router = express.Router();

router.use("/user", userRoutes);
router.use("/tasks", tasksRoutes);

module.exports = router;