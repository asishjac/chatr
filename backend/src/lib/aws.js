import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SESClient } from "@aws-sdk/client-ses";
import { RekognitionClient } from "@aws-sdk/client-rekognition";
import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";
import { ENV } from "./env.js";

const awsConfig = {
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY || "test",
  },
  endpoint: ENV.AWS_ENDPOINT, // Required for LocalStack
  forcePathStyle: true,      // Required for LocalStack S3
};

// S3 Client
export const s3Client = new S3Client(awsConfig);

// DynamoDB Client
const ddbClient = new DynamoDBClient(awsConfig);
export const dynamoDB = DynamoDBDocumentClient.from(ddbClient);

// SES Client
export const sesClient = new SESClient(awsConfig);

// Rekognition Client
export const rekognitionClient = new RekognitionClient(awsConfig);

// API Gateway Management API (for WebSockets)
// This will be initialized with a custom endpoint per connection group if needed
export const getApiGwClient = (endpoint) => {
  return new ApiGatewayManagementApiClient({
    ...awsConfig,
    endpoint: endpoint || awsConfig.endpoint,
  });
};
