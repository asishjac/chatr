import { MessageService } from "../services/MessageService.js";
import { WebSocketService } from "../services/WebSocketService.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const filteredUsers = await MessageService.getUsersForSidebar(loggedInUserId);
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.userId;

    const messages = await MessageService.getMessages(myId, userToChatId);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;

    const newMessage = await MessageService.sendMessage(senderId, receiverId, text, image);

    // Real-time emit via AWS-native WebSocket Service
    await WebSocketService.emitToUser(receiverId, "newMessage", newMessage);
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};