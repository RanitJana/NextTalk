import express from "express";
import verify from "../middlewares/verify.middleware.js";
import { putAvatar, putInfo } from "../controllers/user.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.put("/avatar", verify, upload.single("profilePic"), putAvatar);
router.put("/info", verify, putInfo);

export default router;
