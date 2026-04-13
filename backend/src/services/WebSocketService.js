import { getApiGwClient } from "../lib/aws.js";
import { PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { ConnectionRepository } from "../repositories/ConnectionRepository.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

export class WebSocketService {
  /**
   * Sends an event to a specific user across all their active connections.
   */
  static async emitToUser(userId, event, data) {
    // 1. Local Socket.io Delivery
    const socketId = getReceiverSocketId(userId);
    if (socketId) {
      io.to(socketId).emit(event, data);
    }

    // 2. AWS API Gateway Delivery (for persistent/prod connections)
    const connections = await ConnectionRepository.findByUserId(userId);
    if (!connections || connections.length === 0) return;

    const payload = JSON.stringify({ type: event, payload: data });
    const apiGwClient = getApiGwClient();

    const sendPromises = connections.map(async (conn) => {
      try {
        const command = new PostToConnectionCommand({
          ConnectionId: conn.connection_id,
          Data: Buffer.from(payload),
        });
        await apiGwClient.send(command);
      } catch (error) {
        if (error.name === "GoneException") {
          await ConnectionRepository.remove(conn.connection_id);
        }
      }
    });

    await Promise.all(sendPromises);
  }

  /**
   * Broadcasts an event to all connected users.
   */
  static async broadcast(event, data) {
    // 1. Local Socket.io Broadcast
    io.emit(event, data);

    // 2. AWS API Gateway Broadcast
    const allConnections = await ConnectionRepository.getAllConnections();
    if (allConnections.length === 0) return;

    const payload = JSON.stringify({ type: event, payload: data });
    const apiGwClient = getApiGwClient();

    const sendPromises = allConnections.map(async (conn) => {
      try {
        const command = new PostToConnectionCommand({
          ConnectionId: conn.connection_id,
          Data: Buffer.from(payload),
        });
        await apiGwClient.send(command);
      } catch (error) {
        if (error.name === "GoneException") {
          await ConnectionRepository.remove(conn.connection_id);
        }
      }
    });

    await Promise.all(sendPromises);
  }
}
