import mongoose from "mongoose";


const messageModel = mongoose.Schema(
    {
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            trim: true,
        },
        attachments: [
            {
                url: {
                    type: String,
                    required: true
                },
                fileType: {
                    type: String,
                    enum: ["image", "video", "audio", "document", "gif"]
                },
            }
        ],
        chat: {
            type: mongoose.Types.ObjectId,
            ref: "Chat",
            required: true
        },
        replyTo: {
            type: mongoose.Types.ObjectId,
            ref: "Message",
            default: null
        },
        reactions: [
            {
                userId: {
                    type: mongoose.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                reaction: {
                    type: String,
                    required: true
                }
            }
        ],
        readBy: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User"
            }
        ],
    },
    {
        timestamps: true,
    }
)

const Message = mongoose.model("Message", messageModel);

export { Message }
