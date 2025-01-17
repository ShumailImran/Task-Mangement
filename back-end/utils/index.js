import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected");
  } catch (error) {
    console.log("DB error", error);
  }
};

export default dbConnection;

export const createJWT = (userId) => {
  // Generate the token
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1y", // Adjust as needed
  });
};
