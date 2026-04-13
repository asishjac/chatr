import { UserRepository } from "./repositories/UserRepository.js";
import { dynamoDB } from "./lib/aws.js";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ENV } from "./lib/env.js";
import bcrypt from "bcryptjs";

async function repairUser(email) {
  try {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      console.log(`User ${email} not found.`);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const params = {
      TableName: ENV.DYNAMODB_TABLE_USERS || "Users",
      Key: { userId: user.userId },
      UpdateExpression: "set password = :p",
      ExpressionAttributeValues: {
        ":p": hashedPassword,
      },
    };

    await dynamoDB.send(new UpdateCommand(params));
    console.log(`Successfully reset password for ${email} to 'password123'`);
  } catch (err) {
    console.error(`Error repairing ${email}:`, err.message);
  }
}

async function run() {
  await repairUser("alice@example.com");
  await repairUser("bob@example.com");
  process.exit(0);
}

run();
