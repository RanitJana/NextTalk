import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";

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

  // step#1: take input : group name , users and groupIcon(if available)
  const { users, groupName } = req.body;
  // const groupIcon = req.file ? req.file.path : "";

  // console.log("groupIcon: ", groupIcon);

  let groupIconUrl =
    "https://res.cloudinary.com/du4bs9xd2/image/upload/v1742054125/default-group-image_szgp67.jpg";
  // if (groupIcon) {
  //     // upload on cloudinary

  //     let groupIconUpload = await uploadOnCloudinary(groupIcon, req.file.filename);

  //     if (groupIcon && !groupIconUpload.secure_url) {
  //         res
  //             .status(400)
  //             .json({
  //                 message: "Something went wrong while uploading groupIcon pic on cloudinary"
  //             })
  //     }
  //     console.log("groupIconUrl: ", groupIconUpload);
  //     groupIconUrl = groupIconUpload.secure_url;
  // }

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
      groupIcon: groupIconUrl.secure_url,
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
  if (chat?.groupAdmin != req.user._id) {
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

export {
  createOneToOneChat,
  fetchAllChats,
  createGroupChat,
  addToGroup,
  removeFromGroup,
};
