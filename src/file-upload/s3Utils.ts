import * as path from 'path';
import { randomUUID } from 'crypto';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { MAX_FILE_SIZE_BYTES } from './validation';

export const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_IAM_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_S3_IAM_SECRET_KEY!,
  },
});

type S3Upload = {
  fileType: string;
  fileName: string;
  userId: string;
};

export const getUploadFileSignedURLFromS3 = async ({ fileName, fileType, userId }: S3Upload) => {
  const key = getS3Key(fileName, userId);

  const { url: s3UploadUrl, fields: s3UploadFields } = await createPresignedPost(s3Client, {
    Bucket: process.env.AWS_S3_FILES_BUCKET!,
    Key: key,
    Conditions: [['content-length-range', 0, MAX_FILE_SIZE_BYTES]],
    Fields: {
      'Content-Type': fileType,
    },
    Expires: 3600,
  });

  return { s3UploadUrl, key, s3UploadFields };
};

export const getDownloadFileSignedURLFromS3 = async ({ key }: { key: string }) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    Key: key,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

function getS3Key(fileName: string, userId: string) {
  const ext = path.extname(fileName).slice(1);
  return `${userId}/${randomUUID()}.${ext}`;
}

export const uploadBase64ImageToS3 = async ({ imageBuffer, key, output_format }: { imageBuffer: Buffer, key: string, output_format: string }) => {
  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    Key: key,
    Body: new Uint8Array(imageBuffer),
    ContentType: `image/${output_format}`,
  });

  const s3Response = await s3Client.send(uploadCommand);
  return s3Response;
};

export async function uploadBase64ToS3(base64Data: string, userId: string, prefix: string, fileExtension: string): Promise<string> {
  // Extract the actual base64 data and content type
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let contentType = `image/${fileExtension}`; // default
  let base64Content = base64Data;

  if (matches && matches.length === 3) {
    contentType = matches[1];
    base64Content = matches[2];
  }

  // Convert base64 to buffer
  const buffer = Buffer.from(base64Content, 'base64');

  // Generate a unique key for the file
  const key = `${prefix}/${userId}/${randomUUID()}.${fileExtension}`;

  // Upload to S3
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000', // 1 year
  });

  const res = await s3Client.send(command);

  // TODO: return only the key because we're using signed URLs
  // Return the public URL
  return `https://${process.env.AWS_S3_FILES_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
}