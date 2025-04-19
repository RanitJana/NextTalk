import express from "express";
import { registerUser } from "../controllers/auth.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/", upload.single("profilePic"), registerUser);

export default router;
