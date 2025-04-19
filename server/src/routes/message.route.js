import express from "express";
import verify from "../middlewares/verify.middleware.js";
import { postMessage } from "../controllers/message.controller.js";

import upload from "../utils/multer.js";

const router = express.Router();

const cpUpload = upload.fields([
  {
    name: "image",
    maxCount: 5,
  },
  {
    name: "video",
    maxCount: 2,
  },
  {
    name: "audio",
    maxCount: 5,
  },
  {
    name: "document",
    maxCount: 5,
  },
  {
    name: "gif",
    maxCount: 5,
  },
]);

router.post("/", verify, cpUpload, postMessage);

export default router;
