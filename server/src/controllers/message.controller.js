import AsyncHandler from "../utils/AsyncHandler.js";
import messageSchema from "../models/message.model.js";
import fs from "fs/promises";
import { uploadFile } from "../utils/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const postMessage = AsyncHandler(async (req, res) => {
  const { content, chat, replyTo = null } = req.body ?? {};

  if ([content, chat].some((field) => !(field && field.toString().trim())))
    return res.status(400).json({
      success: false,
      message: "content/chat is missing",
    });

  const files = req.files;
  const attachments = [];

  if (files) {
    await Promise.all(
      Object.keys(files).map(async (key) => {
        await Promise.all(
          files[key].map(async (info) => {
            const filePath = path.join(
              __dirname,
              "../public/uploads/",
              info.filename
            );
            try {
              const uploadedFileInfo = await uploadFile(
                filePath,
                info.filename
              );

              attachments.push({ url: uploadedFileInfo.url, fileType: key });
            } catch (error) {
              console.log(error);
            } finally {
              await fs.unlink(filePath);
            }
          })
        );
      })
    );
  }

  // console.log(attachments);

  const newMessage = await messageSchema.create({
    sender: req.user._id,
    content,
    chat,
    attachments,
    replyTo,
  });

  return res.status(200).json({
    success: true,
    message: "added",
    newMessage,
  });
});

const putContentMessage = AsyncHandler(async (req, res) => {
  const { content } = req.body ?? {};

  if (!content)
    return res.status(400).json({
      success: false,
      message: "Content is empty",
    });

  const { messageId } = req.params;

  if (!messageId)
    return res.status(400).json({
      success: false,
      message: "Invalid message",
    });

  const updatedMessage = await messageSchema.findById(messageId);
  updatedMessage.content = content;

  await updatedMessage.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "Message updated",
    updatedMessage,
  });
});

export { postMessage, putContentMessage };
