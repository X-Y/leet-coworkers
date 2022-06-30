import type { NextApiRequest, NextApiResponse } from 'next'
import https from "https";
import {ClientRequest} from "http";

const API_URL = process.env.API_URL;
const ENDPOINT = process.env.API_ENDPOINT_EMPLOYEE;
const AUTH_TOKEN = process.env.API_KEY;

type Employee = {
  name: string,
  email: string,
  phoneNumber: string,
  office: string,
  manager: string,
  orgUnit: string,
  mainText: string,
  gitHub: string,
  twitter: string,
  stackOverflow: string,
  linkedIn: string,
  imagePortraitUrl: string,
  imageWallOfLeetUrl: string,
  highlighted: boolean,
  published: boolean
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Employee[]>
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
      const jsonRes: Employee[] = JSON.parse(output);
      res.status(200).json(jsonRes)
    })
  })

  apiReq.on('error', function(e) {
    console.log('ERROR: ' + e.message);
    res.status(500)
  });
}
