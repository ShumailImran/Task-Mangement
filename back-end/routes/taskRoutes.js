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
  protectedRoute,
  isAdminRoute,
  upload.array("assets", 4),
  createTask
);
router.post("/duplicate/:id", protectedRoute, isAdminRoute, duplicateTask);
router.post("/activity/:id", protectedRoute, postTaskActivity);

router.get("/dashboard", protectedRoute, dashboardStatistics);
router.get("/", protectedRoute, getTasks);
router.get("/:id", protectedRoute, getTask);

router.put("/create-subtask/:id", protectedRoute, isAdminRoute, createSubTask);
router.put(
  "/update/:id",
  protectedRoute,
  isAdminRoute,
  upload.array("assets", 4),
  updateTask
);
router.put("/:id", protectedRoute, isAdminRoute, trashTask);

router.delete(
  "/delete-restore/:id?",
  protectedRoute,
  isAdminRoute,
  deleteRestoreTask
);

export default router;
