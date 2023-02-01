// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { HEAD_IMG_CACHE_TAG } from "../../../lib/getHeadPics";
import headImageCache from "../../../lib/headImgCache";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = HEAD_IMG_CACHE_TAG + req.query["key"];
  const data = headImageCache.get(key);
  res.status(200).end(data);
}
