import express from 'express';
import verify from '../middlewares/verify.middleware.js';
import { addToGroup, createGroupChat, createOneToOneChat, deleteGroupIcon, fetchAllChats, leaveGroup, removeFromGroup, renameGroup, updateGroupIcon } from '../controllers/chat.controller.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.route("/").get(verify, fetchAllChats);                                   // get all chats of user
router.route("/oneToOneChat").post(verify, createOneToOneChat);                 // get one to one chat
router.route("/group").post(verify, upload.single("groupIcon"), createGroupChat);                           // create group chat
router.route("/groupadd").put(verify, addToGroup);                              // add user to group             
router.route("/groupremove").put(verify, removeFromGroup);                      // remove user from group
router.route("/renameGroup").put(verify, renameGroup);                          // rename group
router.route("/updateGroupIcon").put(verify, upload.single("groupIcon"), updateGroupIcon); // update group icon
router.route("/deleteGroupIcon").delete(verify, deleteGroupIcon);                  // delete group icon
router.route("/leaveGroup").post(verify, leaveGroup);                            // leave group


export default router;
