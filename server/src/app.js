import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { _env } from "./constant.js";

const app = express();

const origin = _env.ORIGIN.split(",");

app.use(
  cors({
    origin,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Home route hit",
  });
});

export default app;
