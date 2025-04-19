import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import { deleteFile, uploadFile } from "../utils/cloudinary.js";


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

const createOneToOneChat = AsyncHandler(async (req, res) => {
  /*
   * step#1: verifyJWT->  middleware
   * step#2: provided userId of 2nd person( with whom you will chat )
   * step#3: if Chat object found with users you and 2nd person, send it after removing credentials/secrets
   * step#4: if Chat not found, create one and send it after removing credentials
   */

  // input userid of 2nd person
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "UserId not found to chat with ... ",
    });
  }

  // search for chat with 2nd person
  let isChatPresent = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password") // removing credentials/secrets
    .populate("latestMessage");

  isChatPresent = await User.populate(isChatPresent, {
    path: "latestMessage.sender",
    select: "name profilePic email",
  });

  // if chat present, send it
  if (isChatPresent.length > 0) {
    return res.status(200).json({
      success: true,
      message: "Chat found successfully",
      chat: isChatPresent[0],
    });
  } else {
    // Chat not found, create one
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId], // my_id , 2ndPerson_id
    };

    try {
      const createChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
        // and send it after removing credentials
        "users",
        "-password"
      );
      return res.status(201).json({
        success: true,
        message: "Chat created successfully",
        chat: FullChat,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `something went wrong while creating new chat ${error?.message}`,
      });
    }
  }
});

const fetchAllChats = AsyncHandler(async (req, res) => {
  /*
   * step#1: find all chats with me: search chats with user as me
   * step#2: populate users, groupAdmin, latestMessage and return result removing credentials
   */

  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        return res.status(201).json({
          success: true,
          message: "Chats fetched successfully",
          chats: result,
        });
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error from fetchChats : ${error.message}`,
    });
  }
});

const createGroupChat = AsyncHandler(async (req, res) => {
  /*
   * step#1: take input : group name and users
   * step#2: add yourself and check group count condition
   * step#3: create a new Group Chat object , populate.., remove credentials...
   * step#4: return new groupChat
   */

  const { users, groupName } = req.body;
  const file = req.file;
  // console.log("file: ", file);

  let groupIconUrl = null;

  if (file) {
    const filePath = path.join(
      __dirname,
      "../public/uploads/",
      file.filename
    );
    try {
      const uploadedFileInfo = await uploadFile(
        filePath,
        file.filename
      );
      groupIconUrl = uploadedFileInfo.url;
      // console.log(groupIconUrl)
    } catch (error) {
      console.log(error);
    } finally {
      await fs.unlink(filePath);
    }
  }


  if (!users || !groupName) {
    return res.status(400).json({
      success: false,
      message: "A groupName and Group Participates required",
    });
  }

  let allUsers = users.split(/[,\s]+/).filter((id) => id.trim() !== "");
  console.log("allUsers: ", allUsers);

  if (allUsers.length < 2) {
    return res.status(400).json({
      success: false,
      message: `You need atleast ${2 - allUsers.length} participates to create a group `,
    });
  }

  // step#2: add yourself
  allUsers.push(req.user);

  try {
    // step#3: create a new Group Chat object , populate.., remove credentials...
    const groupChat = await Chat.create({
      chatName: groupName,
      users: allUsers,
      isGroupChat: true,
      groupAdmin: req.user,
      groupIcon: groupIconUrl ?? "https://res.cloudinary.com/du4bs9xd2/image/upload/v1742054125/default-group-image_szgp67.jpg",
    });

    const createdGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    // step#4: return new groupChat
    return res.status(201).json({
      success: true,
      chat: createdGroupChat,
      message: "GroupChat created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Something went wrong while creating GroupChat: ${error.message}`,
    });
  }
});

const addToGroup = AsyncHandler(async (req, res) => {
  /*
   * step#1: take input chatId and userId (whom to add)
   * step#2: find the chat and update, populate..., and send
   */

  const { chatId, userId } = req.body;

  if ([chatId, userId].some((field) => field?.trim() === "")) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  const chat = await Chat.findById(chatId);
  // if (chat?.groupAdmin != req.user._id) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Only group admin can add user to group",
  //   });
  // }


  if (
    !chat.groupAdmin?.some((adminId) =>
      adminId.toString() == req.user._id.toString()
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Only group admin can add user to group",
    });
  }
  const addUserUpdatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!addUserUpdatedChat) {
    return res.status(400).json({
      success: false,
      message: `GroupChat name not updated `,
    });
  }

  return res.status(201).json({
    success: true,
    message: "User added to group successfully",
    chat: addUserUpdatedChat,
  });
});

const removeFromGroup = AsyncHandler(async (req, res) => {
  /*
   * step#1: take input chatId and userId (whom to add)
   * step#2: find the chat and update, populate..., and send
   */

  const { chatId, userId } = req.body;

  if ([chatId, userId].some((field) => field?.trim() === "")) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }


  const chat = await Chat.findById(chatId);
  if (
    !chat.groupAdmin?.some((adminId) =>
      adminId.toString() == req.user._id.toString()
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Only group admin can remove user from group",
    });
  }

  const removeUserUpdatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removeUserUpdatedChat) {
    return res.status(400).json({
      success: false,
      message: `GroupChat name not updated `,
    });
  }

  return res.status(201).json({
    success: true,
    message: "User removed from group successfully",
    chat: removeUserUpdatedChat,
  });
});

const renameGroup = AsyncHandler(async (req, res) => {
  /*
   * step#1: take input chatId and group name
   * step#2: find the chat and update, populate..., and send
   */

  const { chatId, newGroupName } = req.body;

  if ([chatId, newGroupName].some((field) => field?.trim() === "")) {
    return res.status(400).json({
      success: false,
      message: "A selected chat and group name is required",
    });
  }

  const chat = await Chat.findById(chatId);
  if (
    !chat.groupAdmin?.some((adminId) =>
      adminId.toString() == req.user._id.toString()
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Only group admin can rename group",
    });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: newGroupName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    return res.status(400).json({
      success: false,
      message: `GroupChat name not updated `,
    });
  }

  return res.status(201).json({
    success: true,
    message: "Group name updated successfully",
    chat: updatedChat,
  });
});

const updateGroupIcon = AsyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const file = req.file;

  // console.log("file: ", file);

  const chat = await Chat.findById(chatId);

  // check for group admin
  if (!chat.groupAdmin?.some((adminId) => adminId.toString() == req.user._id.toString())) {
    return res.status(400).json({
      success: false,
      message: "Only group admin can update group Icon",
    });
  }

  // check for file
  if (!file) {
    return res.status(400).json({
      success: false,
      message: "Photo not found",
    });
  }

  // upload photo in cloudinary
  let imageUrl = null;
  if (file) {
    const filePath = path.join(
      __dirname,
      "../public/uploads/",
      file.filename
    );
    try {
      const uploadedFileInfo = await uploadFile(
        filePath,
        file.filename
      );
      imageUrl = uploadedFileInfo.url;
      // console.log(imageUrl)
    } catch (error) {
      console.log(error);
    } finally {
      await fs.unlink(filePath);
    }
  }

  if (!imageUrl) {
    return res.status(400).json({
      success: false,
      message: "Image not uploaded",
    });
  }

  // delete previous image from cloudinary
  const prevPic = chat.groupIcon;
  if (prevPic && prevPic !== "https://res.cloudinary.com/du4bs9xd2/image/upload/v1742054125/default-group-image_szgp67.jpg") {
    let prevPicPublicId = extractCloudinaryPublicId(prevPic);

    const deletePrevPic = await deleteFile(prevPicPublicId);
    if (!deletePrevPic) {
      return res.status(400).json({
        success: false,
        message: "Previous image not deleted",
      });
    }
  }

  // update group icon
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      groupIcon: imageUrl,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    return res.status(400).json({
      success: false,
      message: `GroupChat icon not updated `,
    });
  }
  return res.status(201).json({
    success: true,
    message: "Group Icon updated successfully",
    chat: updatedChat,
  });
});

const deleteGroupIcon = AsyncHandler(async (req, res) => {
  const { chatId } = req.body;

  const chat = await Chat.findById(chatId);

  // check for group admin
  if (!chat.groupAdmin?.some((adminId) => adminId.toString() == req.user._id.toString())) {
    return res.status(400).json({
      success: false,
      message: "Only group admin can update group Icon",
    });
  }

  // delete previous image from cloudinary
  const prevPic = chat.groupIcon;
  if (prevPic && prevPic !== "https://res.cloudinary.com/du4bs9xd2/image/upload/v1742054125/default-group-image_szgp67.jpg") {
    let prevPicPublicId = extractCloudinaryPublicId(prevPic);

    const deletePrevPic = await deleteFile(prevPicPublicId);
    if (!deletePrevPic) {
      return res.status(400).json({
        success: false,
        message: "Previous image not deleted",
      });
    }
  }
  const imageUrl = "https://res.cloudinary.com/du4bs9xd2/image/upload/v1742054125/default-group-image_szgp67.jpg";

  // update group icon
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      groupIcon: imageUrl,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    return res.status(400).json({
      success: false,
      message: `GroupChat icon removal failed `,
    });
  }
  return res.status(201).json({
    success: true,
    message: "Group Icon removed successfully",
    chat: updatedChat,
  });
});

const leaveGroup = AsyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({
      success: false,
      message: "ChatId not found",
    });
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(400).json({
      success: false,
      message: "Chat not found",
    });
  }
  if (chat.isGroupChat) {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: req.user._id },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      return res.status(400).json({
        success: false,
        message: `GroupChat not updated `,
      });
    }
    return res.status(201).json({
      success: true,
      message: "Group left successfully",
      chat: updatedChat,
    });
  }
});


export {
  createOneToOneChat,
  fetchAllChats,
  createGroupChat,
  addToGroup,
  removeFromGroup,
  renameGroup,
  updateGroupIcon,
  deleteGroupIcon,
  leaveGroup

};
