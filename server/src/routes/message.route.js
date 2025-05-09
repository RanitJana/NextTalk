import express from "express";
import verify from "../middlewares/verify.middleware.js";
import {
  postMessage,
  putContentMessage,
  putReactionMessage,
  putReadbyMessage,
  getMessage
} from "../controllers/message.controller.js";

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

router.get("/:chatId",verify,getMessage);
router.post("/", verify, cpUpload, postMessage);
router.put("/content/:messageId", verify, putContentMessage);
router.put("/reaction/:messageId", verify, putReactionMessage);
router.put("/readby/:messageId", verify, putReadbyMessage);

export default router;
