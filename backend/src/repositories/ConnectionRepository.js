import { dynamoDB } from "../lib/aws.js";
import { PutCommand, DeleteCommand, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ENV } from "../lib/env.js";

const TABLE_NAME = ENV.DYNAMODB_TABLE_CONNECTIONS;

export class ConnectionRepository {
  static async save(userId, connectionId) {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        connection_id: connectionId,
        userId: userId,
        connectedAt: new Date().toISOString(),
      },
    };

    await dynamoDB.send(new PutCommand(params));
  }

  static async remove(connectionId) {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        connection_id: connectionId,
      },
    };

    await dynamoDB.send(new DeleteCommand(params));
  }

  static async findByUserId(userId) {
    // This requires a GSI on userId in the Connections table for efficient lookup
    // For simplicity in this demo, I'll use a Scan, but in production, a GSI is mandatory.
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const result = await dynamoDB.send(new ScanCommand(params));
    return result.Items || [];
  }

  static async getAllOnlineUsers() {
    const result = await dynamoDB.send(new ScanCommand({ TableName: TABLE_NAME }));
    const userIds = new Set((result.Items || []).map(item => item.userId));
    return Array.from(userIds);
  }

  static async getAllConnections() {
    const result = await dynamoDB.send(new ScanCommand({ TableName: TABLE_NAME }));
    return result.Items || [];
  }
}
