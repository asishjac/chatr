import { dynamoDB } from "../lib/aws.js";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ENV } from "../lib/env.js";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = ENV.DYNAMODB_TABLE_MESSAGES;

export class MessageRepository {
  /**
   * Generates a consistent chat_id for two users by sorting their IDs.
   */
  static getChatId(user1Id, user2Id) {
    return [user1Id, user2Id].sort().join("#");
  }

  static async save(messageData) {
    const { senderId, receiverId, text, image } = messageData;
    const chat_id = this.getChatId(senderId, receiverId);
    const timestamp = Date.now();
    const messageId = uuidv4();

    const newMessage = {
      chat_id,
      timestamp,
      messageId,
      senderId,
      receiverId,
      text: text || "",
      image: image || "",
    };

    const params = {
      TableName: TABLE_NAME,
      Item: newMessage,
    };

    await dynamoDB.send(new PutCommand(params));
    return newMessage;
  }

  static async findByParticipants(user1Id, user2Id) {
    const chat_id = this.getChatId(user1Id, user2Id);
    
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "chat_id = :chat_id",
      ExpressionAttributeValues: {
        ":chat_id": chat_id,
      },
      ScanIndexForward: true, // Order by timestamp ascending
    };

    const result = await dynamoDB.send(new QueryCommand(params));
    return result.Items || [];
  }
}
