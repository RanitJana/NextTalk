import userSchema from "../models/user.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { deleteFile, uploadFile } from "../utils/cloudinary.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function extractCloudinaryPublicId(url) {
  try {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    const pathAfterUpload = url.substring(uploadIndex + 8); // skip "/upload/"
    const parts = pathAfterUpload.split("/");

    // Remove version part if it matches 'v123456...'
    if (/^v\d+$/.test(parts[0])) {
      parts.shift();
    }

    const fullFilename = parts.pop(); // get last part
    const publicId = fullFilename.substring(0, fullFilename.lastIndexOf(".")); // remove only final extension

    return [...parts, publicId].join("/");
  } catch (err) {
    console.error("Error extracting Cloudinary public ID:", err);
    return null;
  }
}

const putAvatar = AsyncHandler(async (req, res) => {
  const file = req.file;
  const user = req.user;

  if (file) {
    const filePath = path.join(__dirname, "../public/uploads/", file.filename);
    try {
      const prevProfilePicLink = user.profilePic;

      const uploadedFileInfo = await uploadFile(filePath, file.filename);

      if (uploadedFileInfo) {
        user.profilePic = uploadedFileInfo.url;

        await user.save({ validateBeforeSave: false });
        await deleteFile(extractCloudinaryPublicId(prevProfilePicLink));
      } else throw Error("Not uploaded");
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "An error occurred",
      });
    } finally {
      await fs.unlink(filePath);
    }
  }

  return res.status(200).json({
    success: true,
    message: "Profile pic updated!",
    user: user,
  });
});

const putInfo = AsyncHandler(async (req, res) => {
  const { name, email, bio } = req.body ?? {};

  if ([name, email, bio].some((field) => !(field && field.trim())))
    return res.status(400).json({
      success: false,
      message: "Inputs must be filled",
    });

  const anotherUser = await userSchema.findOne({
    email: { $eq: email, $ne: req.user.email },
  });

  if (anotherUser)
    return res.status(400).json({
      success: false,
      message: "Anoter user already exits by this email",
    });

  const user = req.user;

  user.email = email;
  user.name = name;
  user.bio = bio;

  await user.save({ validateBeforeSave: false });
  return res.status(200).json({
    success: true,
    message: "Profile updated successfully!",
    user: user,
  });
});

export { putAvatar, putInfo };
