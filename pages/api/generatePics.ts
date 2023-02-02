import { NextApiRequest, NextApiResponse } from "next";

import { getHeadPics } from "../../lib/getHeadPics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const files = (await getHeadPics()) || [];
  res.status(200).json(files);
  return;
}
