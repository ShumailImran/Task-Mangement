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

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: process.env.NODE_ENV !== "development" ? "none" : "strict",
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });

  console.log("Cookie set", res.getHeader("Set-Cookie"));
};
