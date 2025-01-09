import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import dbConnection from "./utils/index.js";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddleware.js";

import routes from "./routes/index.js";
import connectCloudinary from "./config/cloudinary.js";

dotenv.config();

// DB_CONNECTION
dbConnection();
connectCloudinary();

const port = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
