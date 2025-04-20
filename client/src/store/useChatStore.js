// src/store/useChatStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

const useChatStore = create((set, get) => ({
  chats: [],
  users: [],
  selectedChat: null,

  setSelectedChat: (chat) => set({ selectedChat: chat }),

  fetchAllChats: async () => {
    try {
      const { data } = await axiosInstance.get("/chat/");
      set({ chats: data });
    } catch (error) {
      console.error(
        "Error fetching chats:",
        error.response?.data || error.message
      );
    }
  },

  getSearchResults: async (query) => {
    try {
      const { data } = await axiosInstance.get(`/user?search=${query}`);
      set({ users: data });
      console.log("Search results:", data);

      toast.success("Search results fetched successfully!");
      return data;
    } catch (error) {
      toast.error("Error fetching search results!");
      set({ users: [] });
      console.error(
        "Error fetching search results:",
        error.response?.data || error.message
      );
    }
  },

  createOneToOneChat: async (userId) => {
    try {
      const { data } = await axiosInstance.post("/chat/oneToOneChat", {
        userId,
      });
      set((state) => ({ chats: [data, ...state.chats] }));
      toast.success("Chat created successfully!");
      return data;
    } catch (error) {
      console.error(
        "Error creating one-to-one chat:",
        error.response?.data || error.message
      );
    }
  },

  createGroupChat: async (payload) => {
    try {
      const { data } = await axios.post("/api/chat/group", payload);
      set((state) => ({ chats: [data, ...state.chats] }));
      return data;
    } catch (error) {
      console.error(
        "Error creating group chat:",
        error.response?.data || error.message
      );
    }
  },

  addToGroup: async (chatId, userId) => {
    try {
      const { data } = await axios.put("/api/chat/group-add", {
        chatId,
        userId,
      });
      set((state) => ({
        chats: state.chats.map((chat) => (chat._id === chatId ? data : chat)),
      }));
      return data;
    } catch (error) {
      console.error(
        "Error adding user to group:",
        error.response?.data || error.message
      );
    }
  },

  removeFromGroup: async (chatId, userId) => {
    try {
      const { data } = await axios.put("/api/chat/group-remove", {
        chatId,
        userId,
      });
      set((state) => ({
        chats: state.chats.map((chat) => (chat._id === chatId ? data : chat)),
      }));
      return data;
    } catch (error) {
      console.error(
        "Error removing user from group:",
        error.response?.data || error.message
      );
    }
  },

  renameGroup: async (chatId, newName) => {
    try {
      const { data } = await axios.put("/api/chat/rename", {
        chatId,
        chatName: newName,
      });
      set((state) => ({
        chats: state.chats.map((chat) => (chat._id === chatId ? data : chat)),
      }));
      return data;
    } catch (error) {
      console.error(
        "Error renaming group:",
        error.response?.data || error.message
      );
    }
  },

  updateGroupIcon: async (chatId, file) => {
    try {
      const formData = new FormData();
      formData.append("chatId", chatId);
      formData.append("file", file);

      const { data } = await axios.put("/api/chat/update-group-icon", formData);
      set((state) => ({
        chats: state.chats.map((chat) => (chat._id === chatId ? data : chat)),
      }));
      return data;
    } catch (error) {
      console.error(
        "Error updating group icon:",
        error.response?.data || error.message
      );
    }
  },

  deleteGroupIcon: async (chatId) => {
    try {
      const { data } = await axios.put("/api/chat/delete-group-icon", {
        chatId,
      });
      set((state) => ({
        chats: state.chats.map((chat) => (chat._id === chatId ? data : chat)),
      }));
      return data;
    } catch (error) {
      console.error(
        "Error deleting group icon:",
        error.response?.data || error.message
      );
    }
  },

  leaveGroup: async (chatId) => {
    try {
      const { data } = await axios.put("/api/chat/leave-group", { chatId });
      set((state) => ({
        chats: state.chats.filter((chat) => chat._id !== chatId),
      }));
      return data;
    } catch (error) {
      console.error(
        "Error leaving group:",
        error.response?.data || error.message
      );
    }
  },
}));

export default useChatStore;
