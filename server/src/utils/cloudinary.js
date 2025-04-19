import { v2 as cloudinary } from "cloudinary";
import { _env } from "../constant.js";

cloudinary.config({
  cloud_name: _env.CLOUD_NAME,
  api_key: _env.API_KEY,
  api_secret: _env.API_SECRET,
});

const uploadFile = async function (filePath, name) {
  const uploadResult = await cloudinary.uploader
    .upload(filePath, { public_id: `${name}`, folder: "NextTalk" })
    .catch((err) => {
      console.log(err);
    });
  return uploadResult;
};

const deleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId, (err, res) => {
    if (err) console.log(err);
  });
};

export { uploadFile, deleteFile };
