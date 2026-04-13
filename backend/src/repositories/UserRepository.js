import { dynamoDB } from "../lib/aws.js";
import { GetCommand, PutCommand, QueryCommand, UpdateCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ENV } from "../lib/env.js";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = ENV.DYNAMODB_TABLE_USERS;

export class UserRepository {
  static async findByEmail(email) {
    const params = {
      TableName: TABLE_NAME,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const result = await dynamoDB.send(new QueryCommand(params));
    return result.Items?.[0] || null;
  }

  static async findById(userId) {
    const params = {
      TableName: TABLE_NAME,
      Key: { userId },
    };

    const result = await dynamoDB.send(new GetCommand(params));
    return result.Item || null;
  }

  static async create(userData) {
    const userId = uuidv4();
    const newUser = {
      userId,
      ...userData,
      profilePic: userData.profilePic || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const params = {
      TableName: TABLE_NAME,
      Item: newUser,
    };

    await dynamoDB.send(new PutCommand(params));
    return newUser;
  }

  static async updateProfilePic(userId, profilePicUrl) {
    const params = {
      TableName: TABLE_NAME,
      Key: { userId },
      UpdateExpression: "set profilePic = :p, updatedAt = :u",
      ExpressionAttributeValues: {
        ":p": profilePicUrl,
        ":u": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDB.send(new UpdateCommand(params));
    return result.Attributes;
  }

  static async getAllUsersExcept(currentUserId) {
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "userId <> :currentUserId",
      ExpressionAttributeValues: {
        ":currentUserId": currentUserId,
      },
    };

    const result = await dynamoDB.send(new ScanCommand(params));
    // Remove passwords before returning
    return (result.Items || []).map(user => {
      const { password, ...rest } = user;
      return rest;
    });
  }
}
