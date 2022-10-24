import type { NextApiRequest, NextApiResponse } from 'next'
import https from "https";
import {ClientRequest} from "http";
import cacheData from "memory-cache";

import {Coworker} from "../../interfaces/CoworkerModel";


const API_URL = process.env.API_URL;
const ENDPOINT = process.env.API_ENDPOINT_EMPLOYEE;
const AUTH_TOKEN = process.env.API_KEY;
const {USE_MOCK_API_DATA, MOCK_API_DATA} = process.env;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Coworker[]>
) {
  if(USE_MOCK_API_DATA === 'true' && MOCK_API_DATA) {
    const jsonRes: Coworker[] = JSON.parse(MOCK_API_DATA);
    console.log('Using mock API response');
    console.log('Mock API response length is', jsonRes.length)
    res.status(200).json(jsonRes)

    return ;
  }


  const leetCoworkerUrl: URL = new URL(ENDPOINT || '', API_URL || '');

  const cacheHours = 24;
  const stringRes = cacheData.get(leetCoworkerUrl);
  if(stringRes) {
    const jsonRes: Coworker[] = JSON.parse(stringRes);
    console.log('Using cached API response');
    console.log('Cached API response length is', jsonRes.length)
    res.status(200).json(jsonRes)
    return ;
  }

  console.log('Using real API...')

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
      cacheData.put(leetCoworkerUrl, output, cacheHours * 1000 * 60 * 60);
      const jsonRes: Coworker[] = JSON.parse(output);
      console.log('API response length is', jsonRes.length)
      res.status(200).json(jsonRes)
    })
  })

  apiReq.on('error', function(e) {
    console.log('ERROR: ' + e.message);
    res.status(500)
  });
}
