import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;

const BUCKET = "guessinggame-head-imgs";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export const saveImg = async (filename: string, data: Buffer) => {
  return await S3.send(
    new PutObjectCommand({ Bucket: BUCKET, Key: filename, Body: data })
  );
};

export const listImgs = async () => {
  return await S3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
};

export const getImgUrl = async (filename: string) => {
  return await getSignedUrl(
    S3,
    new GetObjectCommand({ Bucket: BUCKET, Key: filename }),
    { expiresIn: 3600 }
  );
};
