import cacheData from "memory-cache";
import { Coworker } from "../interfaces/CoworkerModel";
import { ClientRequest } from "http";
import https from "https";

const API_URL = process.env.API_URL;
const ENDPOINT = process.env.API_ENDPOINT_EMPLOYEE;
const AUTH_TOKEN = process.env.API_KEY;

export const fetchCoworkersApi = async () => {
  const leetCoworkerUrl: URL = new URL(ENDPOINT || "", API_URL || "");

  const cacheHours = 24;
  const stringRes = cacheData.get(leetCoworkerUrl);
  if (stringRes) {
    const jsonRes: Coworker[] = JSON.parse(stringRes);
    console.log("Using cached API response");
    console.log("Cached API response length is", jsonRes.length);
    return jsonRes;
  }

  console.log("Using real API...");

  return new Promise<Coworker[]>((resolve, reject) => {
    const apiReq: ClientRequest = https.get(
      leetCoworkerUrl,
      {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      },
      (apiRes) => {
        console.log("STATUS: " + apiRes.statusCode);
        console.log("HEADERS: " + JSON.stringify(apiRes.headers));

        apiRes.setEncoding("utf8");

        let output: string = "";
        apiRes
          .on("data", function (chunk: string) {
            output += chunk;
          })
          .on("end", function () {
            cacheData.put(leetCoworkerUrl, output, cacheHours * 1000 * 60 * 60);
            const jsonRes: Coworker[] = JSON.parse(output);
            console.log("API response length is", jsonRes.length);
            resolve(jsonRes);
          });
      }
    );

    apiReq.on("error", function (e) {
      reject("ERROR: " + e.message);
    });
  });
};
