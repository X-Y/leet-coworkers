import type { NextApiRequest, NextApiResponse } from "next";

import { Coworker } from "../../interfaces/CoworkerModel";

import { fetchCoworkersApi } from "../../lib/backendApi";

const { USE_MOCK_API_DATA, MOCK_API_DATA } = process.env;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Coworker[]>
) {
  if (USE_MOCK_API_DATA === "true" && MOCK_API_DATA) {
    const jsonRes: Coworker[] = JSON.parse(MOCK_API_DATA);
    console.log("Using mock API response");
    console.log("Mock API response length is", jsonRes.length);
    res.status(200).json(jsonRes);

    return;
  }

  try {
    const data = await fetchCoworkersApi();
    res.status(200).json(data);
    return;
  } catch (e) {
    res.status(500);
  }
}
