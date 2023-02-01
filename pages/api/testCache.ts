// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cacheData from "memory-cache";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = cacheData.exportJson();
  res.status(200).json(data);
}
