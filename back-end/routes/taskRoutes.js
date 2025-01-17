import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
} from "../controllers/taskController.js";
import { isAdminRoute, protectedRoute } from "../middlewares/authMiddleware.js";

import upload from "../controllers/multer.js";

const router = express.Router();

router.post(
  "/create",

  isAdminRoute,
  upload.array("assets", 4),

  createTask
);
router.post("/duplicate/:id", isAdminRoute, duplicateTask);
router.post("/activity/:id", postTaskActivity);

router.get("/dashboard", dashboardStatistics);
router.get("/", getTasks);
router.get("/:id", getTask);

router.put("/create-subtask/:id", isAdminRoute, createSubTask);
router.put(
  "/update/:id",

  isAdminRoute,
  upload.array("assets", 4),
  updateTask
);
router.put("/:id", isAdminRoute, trashTask);

router.delete(
  "/delete-restore/:id?",

  isAdminRoute,
  deleteRestoreTask
);

export default router;
