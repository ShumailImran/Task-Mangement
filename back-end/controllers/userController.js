import asyncHandler from "express-async-handler";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import { createJWT } from "../utils/index.js";

// // // REGISTER_USER // // //
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin, role, title } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400).json({ status: false, message: "User already exists" });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
    role,
    title,
  });

  if (user) {
    const token = createJWT(user._id);
    user.password = undefined;

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      user,
      token,
    });
  } else {
    res.status(400).json({ status: false, message: "Failed to register user" });
  }
});

// // // LOGIN_USER // // //
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res
      .status(401)
      .json({ status: false, message: "Invalid email or password" });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({
      status: false,
      message: "Account is deactivated. Contact the administrator.",
    });
    return;
  }

  const token = createJWT(user._id);
  user.password = undefined;

  res.status(200).json({
    status: true,
    message: "Login successful",
    user,
    token,
  });
});

// // // LOGOUT_USER // // //
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ status: true, message: "Logged out successfully" });
});

// // // GET_TEAM_LIST // // //
export const getTeamList = asyncHandler(async (req, res) => {
  const users = await User.find().select("name title email role isActive");
  res.status(200).json({ status: true, users });
});

// // // GET_NOTIFICATIONS_LIST // // //
export const getNotificationList = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const notification = await Notification.find({
    team: userId,
    isRead: { $nin: [userId] },
  }).populate("task", "title");

  res.status(200).json({ status: true, notification });
});

// // // UPDATE_USER_PROFILE // // //
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { _id } = req.body;

  const id = isAdmin && userId !== _id ? _id : userId;

  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ status: false, message: "User not found" });
    return;
  }

  user.name = req.body.name || user.name;
  user.title = req.body.title || user.title;
  user.role = req.body.role || user.role;

  const updatedUser = await user.save();
  updatedUser.password = undefined;

  res.status(200).json({
    status: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

// // // MARK_NOTIFICATION_READ // // //
export const markNotificationRead = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { isReadType, id } = req.query;

  if (isReadType === "all") {
    await Notification.updateMany(
      { team: userId, isRead: { $nin: [userId] } },
      { $push: { isRead: userId } },
      { new: true }
    );
  } else {
    await Notification.findOneAndUpdate(
      { _id: id, isRead: { $nin: [userId] } },
      { $push: { isRead: userId } },
      { new: true }
    );
  }

  res
    .status(200)
    .json({ status: true, message: "Notifications marked as read" });
});

// // // CHANGE_USER_PASSWORD // // //
export const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ status: false, message: "User not found" });
    return;
  }

  user.password = req.body.password;
  await user.save();

  res.status(200).json({
    status: true,
    message: "Password updated successfully",
  });
});

// // // ACTIVATE_USER_PROFILE // // //
export const activateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ status: false, message: "User not found" });
    return;
  }

  user.isActive = req.body.isActive;
  await user.save();

  res.status(200).json({
    status: true,
    message: `User account has been ${
      user.isActive ? "activated" : "deactivated"
    } successfully`,
  });
});

// // // DELETE_USER_PROFILE // // //
export const deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    res.status(404).json({ status: false, message: "User not found" });
    return;
  }

  res.status(200).json({ status: true, message: "User deleted successfully" });
});
