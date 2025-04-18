

import mongoose from "mongoose";

const chatModel = mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true,
        },
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        // for one-to-one chat, in users array, there will be 1 users, for group, >2
        users: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            }
        ],
        latestMessage: {
            type: mongoose.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            }
        ],
        groupIcon: {
            type: String,
            default: function () {
                return this.isGroupChat ? "https://res.cloudinary.com/du4bs9xd2/image/upload/v1742054125/default-group-image_szgp67.jpg" : "";
            },
        },
    },
    {
        timestamps: true
    }
);

const Chat = mongoose.model("Chat", chatModel);
export { Chat };
