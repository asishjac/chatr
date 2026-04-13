import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  // AWS Configurations
  AWS_REGION: process.env.AWS_REGION || "us-east-1",
  AWS_ENDPOINT: process.env.AWS_ENDPOINT, // For LocalStack
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

  // Tables
  DYNAMODB_TABLE_USERS: process.env.DYNAMODB_TABLE_USERS || "Users",
  DYNAMODB_TABLE_MESSAGES: process.env.DYNAMODB_TABLE_MESSAGES || "Messages",
  DYNAMODB_TABLE_CONNECTIONS: process.env.DYNAMODB_TABLE_CONNECTIONS || "Connections",

  // S3
  S3_BUCKET_UPLOADS: process.env.S3_BUCKET_UPLOADS || "chatr-uploads",
  S3_PUBLIC_URL: process.env.S3_PUBLIC_URL,

  // Email
  EMAIL_FROM: process.env.EMAIL_FROM || "onboarding@chatr.dev",
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "Chatr Support",
};

// --- Production Readiness: Environment Validation ---
const validateEnv = () => {
  const required = ["JWT_SECRET"];
  
  if (ENV.NODE_ENV === "production") {
    required.push("AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "CLIENT_URL");
  }

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`\x1b[31m[Critical] Missing Environment Variables: ${missing.join(", ")}\x1b[0m`);
    // In production, we should exit to avoid running in an insecure/broken state
    if (ENV.NODE_ENV === "production") {
      process.exit(1);
    }
  } else {
    console.log("\x1b[32m[System] Environment Validation: Pass\x1b[0m");
  }
};

validateEnv();