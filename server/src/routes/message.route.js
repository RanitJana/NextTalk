import express from "express";
import verify from "../middlewares/verify.middleware.js";
import { postMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", verify, postMessage);

export default router;
