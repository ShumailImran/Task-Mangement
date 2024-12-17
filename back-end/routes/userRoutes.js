import express from "express";
import { isAdminRoute, protectedRoute } from "../middlewares/authMiddleware.js";
import {
  activateUserProfile,
  changeUserPassword,
  getNotificationList,
  getTeamList,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
  deleteUserProfile,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get-team", protectedRoute, isAdminRoute, getTeamList);
router.get("/notification", protectedRoute, getNotificationList);

router.put("/profile", protectedRoute, updateUserProfile);
router.put("/read-noti", protectedRoute, markNotificationRead);
router.put("/change-password", protectedRoute, changeUserPassword);

// // FOR ADMIN ONLY
router
  .route("/:id")
  .put(protectedRoute, isAdminRoute, activateUserProfile)
  .delete(protectedRoute, isAdminRoute, deleteUserProfile);

export default router;
