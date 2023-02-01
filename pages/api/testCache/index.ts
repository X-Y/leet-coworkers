// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import headImageCache from "../../../lib/headImgCache";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = headImageCache.keys();
  res.status(200).json(data);
}
