import { NextApiRequest, NextApiResponse } from "next";

import { HEAD_IMG_CACHE_TAG } from "../../../lib/getHeadPics";
import headImgCache from "../../../lib/headImgCache";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>
) {
  const name = req.query["name"];
  if (typeof name !== "string") {
    res.status(500).end("Not a string");
    return;
  }

  const bufferData = headImgCache.get(name) as Buffer;

  if (!bufferData) {
    res.status(500).end("no data");
    return;
  }

  res
    .writeHead(200, {
      "Content-Type": "text/plain",
      "Content-Length": bufferData.length,
    })
    .end(bufferData);
}
