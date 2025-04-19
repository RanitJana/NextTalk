import express from 'express';
import verify from '../middlewares/verify.middleware.js';
import { addToGroup, createGroupChat, createOneToOneChat, fetchAllChats, removeFromGroup } from '../controllers/chat.controller.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.route("/").get(verify, fetchAllChats);                                   // get all chats of user
router.route("/oneToOneChat").post(verify, createOneToOneChat);                 // get one to one chat
router.route("/group").post(verify, upload.single("groupIcon"), createGroupChat);                           // create group chat
router.route("/groupadd").put(verify, addToGroup);                              // add user to group             
router.route("/groupremove").put(verify, removeFromGroup);                      // remove user from group




export default router;
