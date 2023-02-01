import { NextApiRequest, NextApiResponse } from "next";
import cacheData from "memory-cache";

import { HEAD_IMG_CACHE_TAG } from "../../../lib/getHeadPics";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>
) {
  const name = req.query["name"];
  if (typeof name !== "string") {
    res.status(500);
    return;
  }

  const bufferData = cacheData.get(HEAD_IMG_CACHE_TAG + name) as Buffer;

  if (!bufferData) {
    res.status(500).end();
    return;
  }

  res
    .writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": bufferData.length,
    })
    .end(bufferData);
}
