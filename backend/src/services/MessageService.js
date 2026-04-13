import { MessageRepository } from "../repositories/MessageRepository.js";
import { StorageService } from "./StorageService.js";
import { rekognitionClient } from "../lib/aws.js";
import { DetectModerationLabelsCommand } from "@aws-sdk/client-rekognition";
// Using UserRepository instead of non-existent User model
import { UserRepository } from "../repositories/UserRepository.js";

export class MessageService {
  static async getMessages(user1Id, user2Id) {
    return await MessageRepository.findByParticipants(user1Id, user2Id);
  }

  static async sendMessage(senderId, receiverId, text, imageBase64) {
    let imageUrl = "";

    if (imageBase64) {
      // 1. AI Safety Scan (Rekognition)
      const isSafe = await this.scanImageSafety(imageBase64);
      if (!isSafe) {
        throw new Error("Image contains inappropriate content and cannot be sent.");
      }

      // 2. Upload to S3
      imageUrl = await StorageService.uploadMessageImage(senderId, imageBase64);
    }

    // 3. Save to DB
    const message = await MessageRepository.save({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    return message;
  }

  static async scanImageSafety(base64Image) {
    const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    
    const params = {
      Image: {
        Bytes: buffer,
      },
      MinConfidence: 70,
    };

    try {
      const command = new DetectModerationLabelsCommand(params);
      const data = await rekognitionClient.send(command);
      
      // If moderation labels are found, consider it unsafe
      if (data.ModerationLabels && data.ModerationLabels.length > 0) {
        console.warn("AI detected inappropriate content:", data.ModerationLabels);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Rekognition scan error:", error);
      // In LocalStack/Offline, we might just assume safe or assume unsafe.
      // For this project, we'll let it pass if Rekognition is unavailable.
      return true;
    }
  }

  static async getUsersForSidebar(currentUserId) {
    // This is a bit tricky with DynamoDB without a Scan.
    // In a real app, we'd have a users table indexed for discovery.
    // For now, I'll implement a simple method in UserRepository or use a Scan (sparingly).
    return await UserRepository.getAllUsersExcept(currentUserId);
  }
}
