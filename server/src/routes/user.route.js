import express from "express";
import verify from "../middlewares/verify.middleware.js";
import { putAvatar } from "../controllers/user.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.put("/avatar", verify, upload.single("profilePic"), putAvatar);

export default router;
