import { s3Client } from "../lib/aws.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ENV } from "../lib/env.js";

export class StorageService {
  static async uploadProfilePic(userId, base64Image) {
    const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const type = base64Image.split(';')[0].split('/')[1] || 'jpeg';
    
    const key = `profiles/${userId}/${Date.now()}.${type}`;
    
    const params = {
      Bucket: ENV.S3_BUCKET_UPLOADS,
      Key: key,
      Body: buffer,
      ContentType: `image/${type}`,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const baseUrl = ENV.S3_PUBLIC_URL || ENV.AWS_ENDPOINT || 'http://localhost:4566';
    return `${baseUrl}/${ENV.S3_BUCKET_UPLOADS}/${key}`;
  }

  static async uploadMessageImage(senderId, base64Image) {
    const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const type = base64Image.split(';')[0].split('/')[1] || 'jpeg';
    
    const key = `messages/${senderId}/${Date.now()}.${type}`;
    
    const params = {
      Bucket: ENV.S3_BUCKET_UPLOADS,
      Key: key,
      Body: buffer,
      ContentType: `image/${type}`,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const baseUrl = ENV.S3_PUBLIC_URL || ENV.AWS_ENDPOINT || 'http://localhost:4566';
    return `${baseUrl}/${ENV.S3_BUCKET_UPLOADS}/${key}`;
  }
}
