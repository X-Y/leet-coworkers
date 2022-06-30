import type { NextApiRequest, NextApiResponse } from 'next'
import https from "https";
import {ClientRequest} from "http";

import {Coworker} from "../../interfaces/CoworkerModel";


const API_URL = process.env.API_URL;
const ENDPOINT = process.env.API_ENDPOINT_EMPLOYEE;
const AUTH_TOKEN = process.env.API_KEY;



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Coworker[]>
) {
  const leetCoworkerUrl: URL = new URL(ENDPOINT || '', API_URL || '');

  const apiReq: ClientRequest = https.get(leetCoworkerUrl, {
    headers: {
      'Authorization': AUTH_TOKEN
    }
  }, (apiRes) => {
    console.log('STATUS: ' + apiRes.statusCode);
    console.log('HEADERS: ' + JSON.stringify(apiRes.headers));

    apiRes.setEncoding('utf8');

    let output: string = '';
    apiRes.on('data', function(chunk: string) {
      output += chunk;
    }).on('end', function() {
      const jsonRes: Coworker[] = JSON.parse(output);
      res.status(200).json(jsonRes)
    })
  })

  apiReq.on('error', function(e) {
    console.log('ERROR: ' + e.message);
    res.status(500)
  });
}
