const express = require("express");
const { createNewTask, createActivity, startTask, markCompleted, createSubTask, markSubtaskCompleted, deleteSubTask, getAllTasks, getTask, updateTask, moveTaskToTrash, getTrashedTasks, restoreTrashedTask, deleteTrashedTasks, uploadAsset, deleteAsset, editTaskStatus } = require("../controllers/taskController");
const { userAuth } = require("../middlewares/auth");

const router = express.Router();

// Create new task
router.post("/", userAuth, createNewTask);

// GET task
router.get("/trash", userAuth, getTrashedTasks);

// restore trash task
router.put("/trash/:id", userAuth, restoreTrashedTask);

// Create a sub-task
router.post("/:id/sub-task", userAuth, createSubTask);

// Create a new Activity
router.put("/:id/activity",userAuth, createActivity);

// Upload a new Asset
router.put("/:id/asset", userAuth, uploadAsset);

// Delete Asset
router.delete("/:id/asset/:assetId", userAuth, deleteAsset);

// Get all tasks
router.get("/", userAuth, getAllTasks);

// Get task
router.get("/:id", userAuth, getTask);

// Start Task
router.put("/:id/start", userAuth, startTask);

// Mark Task as Completed
router.put("/:id/completed", userAuth, markCompleted);

// Update Task
router.put("/:id", userAuth, updateTask);

//  Update task status
router.put("/editStatus/:id", userAuth, editTaskStatus);

//  Mark Subtask completed
router.put("/:id/sub-task/:subTaskId", userAuth, markSubtaskCompleted);

// Delete Sub-task
router.delete("/:id/sub-task/:subTaskId", userAuth, deleteSubTask);

// Move task to trash
router.delete("/:id", userAuth, moveTaskToTrash);

// Permanently delete trashed task
router.delete("/trash/:id", userAuth, deleteTrashedTasks);

module.exports = router;