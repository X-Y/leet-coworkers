// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cacheData from "memory-cache";
import { HEAD_IMG_CACHE_TAG } from "../../../lib/getHeadPics";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = HEAD_IMG_CACHE_TAG + req.query["key"];
  const data = cacheData.get(key);
  res.status(200).end(data);
}
