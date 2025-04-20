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

  if (!updatedMessage)
    return res.status(400).json({
      success: false,
      message: "No such message is found",
    });

  updatedMessage.content = content;

  await updatedMessage.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "Message updated",
    updatedMessage,
  });
});

const putReactionMessage = AsyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { reaction } = req.body ?? {};

  if (!messageId)
    return res.status(400).json({
      success: false,
      message: "Invalid message",
    });

  const messageInfo = await messageSchema.findById(messageId);

  if (!messageInfo)
    return res.status(400).json({
      success: false,
      message: "No such message is found",
    });

  const userId = req.user._id;

  messageInfo.reactions = messageInfo.reactions.filter(
    (item) => item.userId.toString() !== userId.toString()
  );

  if (reaction) messageInfo.reactions.push({ userId, reaction });

  await messageInfo.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "Message updated",
    updatedMessage: messageInfo,
  });
});

const putReadbyMessage = AsyncHandler(async (req, res) => {
  const {} = req.body;

  return res.status(200).json({
    success: true,
    message: "done",
  });
});

const getMessage = AsyncHandler(async (req, res) => {
  const { chatId } = req.params ?? {};
  if (!chatId)
    return res.status(400).json({
      success: false,
      message: "Invalid chat id",
    });

  const allChats = await messageSchema
    .find({ chat: chatId })
    .populate("sender", "name profilePic email");

  return res.status(200).json({
    success: true,
    message: "Obtained",
    allChats,
  });
});

export {
  postMessage,
  putContentMessage,
  putReactionMessage,
  putReadbyMessage,
  getMessage,
};
