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

router.get("/get-team", isAdminRoute, getTeamList);
router.get("/notification", getNotificationList);

router.put("/profile", updateUserProfile);
router.put("/read-noti", markNotificationRead);
router.put("/change-password", changeUserPassword);

// // FOR ADMIN ONLY
router
  .route("/:id")
  .put(isAdminRoute, activateUserProfile)
  .delete(isAdminRoute, deleteUserProfile);

export default router;
