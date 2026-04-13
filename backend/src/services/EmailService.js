import { sesClient } from "../lib/aws.js";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { ENV } from "../lib/env.js";

export class EmailService {
  static async sendWelcome(toEmail, name) {
    const params = {
      Source: `${ENV.EMAIL_FROM_NAME} <${ENV.EMAIL_FROM}>`,
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Subject: {
          Data: "Welcome to Chatr!",
        },
        Body: {
          Html: {
            Data: `
              <h1>Welcome to Chatr, ${name}!</h1>
              <p>We're excited to have you on board.</p>
              <p>Start chatting today at ${ENV.CLIENT_URL}</p>
            `,
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      await sesClient.send(command);
      console.log(`Welcome email sent to ${toEmail}`);
    } catch (error) {
      console.error("Error sending SES email:", error);
      // Don't throw here to avoid blocking auth flow if email fails in localstack
    }
  }
}
