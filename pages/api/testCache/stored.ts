import type { NextApiRequest, NextApiResponse } from "next";
import NodeCache from "node-cache";

import elseCache from "../../../lib/headImgCache";

const myCache = new NodeCache();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const time = Date.now();
  myCache.set(time, "");
  elseCache.set(time, "");
  const caches = myCache.keys();
  const caches2 = elseCache.keys();

  res.status(200).json({
    here: caches,
    elsewhere: caches2,
  });
}
