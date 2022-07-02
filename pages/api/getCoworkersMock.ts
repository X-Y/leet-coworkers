import type { NextApiRequest, NextApiResponse } from 'next'
import https from "https";
import {ClientRequest} from "http";

import {Coworker} from "../../interfaces/CoworkerModel";
import mockJson from '../../lib/testData2.json';

const API_URL = process.env.API_URL;
const ENDPOINT = process.env.API_ENDPOINT_EMPLOYEE;
const AUTH_TOKEN = process.env.API_KEY;



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Coworker[]>
) {
  res.status(200).json(mockJson as Coworker[])
}
