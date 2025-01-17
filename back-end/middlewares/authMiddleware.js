import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware to protect routes that require authentication
const protectedRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decodedToken.userId).select(
        "isAdmin email"
      );

      if (!user) {
        return res
          .status(401)
          .json({ status: false, message: "User not found" });
      }

      req.user = {
        email: user.email,
        isAdmin: user.isAdmin,
        userId: decodedToken.userId,
      };

      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized, token missing" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: false, message: "Invalid token" });
  }
};

// Middleware to check if the user is an admin
const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      status: false,
      message: "Not authorized as admin. Please login as an admin",
    });
  }
};

export { protectedRoute, isAdminRoute };
