import express from "express";
import { isAdminRoute, protectedRoute } from "../middlewares/authMiddleware.js";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
  deleteRestoreTask,
} from "../controllers/taskController.js";
const router = express.Router();

router.post("/create", protectedRoute, isAdminRoute, createTask);
router.post("/duplicate/:id", protectedRoute, isAdminRoute, duplicateTask);
router.post("/activity/:id", protectedRoute, isAdminRoute, postTaskActivity);

router.get("/dashboard", protectedRoute, dashboardStatistics);
router.get("/", protectedRoute, getTasks);
router.get("/:id", protectedRoute, getTask);

router.put("/create-subtask/:id", protectedRoute, isAdminRoute, createSubTask);
router.put("/update/:id", protectedRoute, isAdminRoute, updateTask);
router.put("/:id", protectedRoute, isAdminRoute, trashTask);

router.delete(
  "/delete-restore/:id?",
  protectedRoute,
  isAdminRoute,
  deleteRestoreTask
);

export default router;
