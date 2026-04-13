import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadCounts: {}, // userId -> count

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
      // Initialize unread counts only if not already present
      const currentCounts = get().unreadCounts;
      const newCounts = { ...currentCounts };
      res.data.forEach(user => {
        if (newCounts[user.userId] === undefined) newCounts[user.userId] = 0;
      });
      set({ unreadCounts: newCounts });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser.userId}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const handleNewMessage = (event) => {
      const newMessage = event.detail;
      const { selectedUser, messages, unreadCounts } = get();
      
      const isFromSelectedUser = selectedUser?.userId === newMessage.senderId;

      if (isFromSelectedUser) {
        set({
          messages: [...messages, newMessage],
        });
      } else {
        // Increment unread count for the sender
        set({
          unreadCounts: {
            ...unreadCounts,
            [newMessage.senderId]: (unreadCounts[newMessage.senderId] || 0) + 1
          }
        });
      }
    };

    window.addEventListener("ws:newMessage", handleNewMessage);
    set({ _messageHandler: handleNewMessage });
  },

  unsubscribeFromMessages: () => {
    const { _messageHandler } = get();
    if (_messageHandler) {
      window.removeEventListener("ws:newMessage", _messageHandler);
      set({ _messageHandler: null });
    }
  },

  setSelectedUser: (user) => {
    if (!user) {
      set({ selectedUser: null });
      return;
    }
    
    set({ selectedUser: user });
    
    // Reset unread count for this user
    const { unreadCounts } = get();
    set({
      unreadCounts: {
        ...unreadCounts,
        [user.userId]: 0
      }
    });
  },
}));
