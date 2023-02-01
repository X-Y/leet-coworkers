import https from "https";
import fs from "fs";
import cacheData from "memory-cache";
import sharp from "sharp";

import { Coworker } from "../interfaces/CoworkerModel";
import makeSilhouette from "./makeSilhouette";

const API_URL = process.env.API_URL;
const ENDPOINT = process.env.API_ENDPOINT_EMPLOYEE;

const TEMP_PROCESSED = "/tmp/leet-coworkers/out";

const num = 5;
const cache_num = 15;

const getProcessedFilePath = (name: string) => TEMP_PROCESSED + "/" + name;

const getCachedFiles = async () => {
  try {
    return await fs.promises.readdir(TEMP_PROCESSED);
  } catch (err) {
    console.error("Error occurred while reading directory!", err);
  }
};

const pickRandoms = <T>(arr: T[], num: number) => {
  const resSet: Set<T> = new Set();

  while (resSet.size < num) {
    const randomIdx = ~~(Math.random() * arr.length);
    const item = arr[randomIdx];
    resSet.add(item);
  }

  return Array.from(resSet.values());
};

const getRandomFromCache = () => {
  const leetCoworkerUrl: URL = new URL(ENDPOINT || "", API_URL || "");
  const stringData = cacheData.get(leetCoworkerUrl);
  const jsonData: Coworker[] = JSON.parse(stringData);

  const resSet: Set<Coworker> = new Set();

  while (resSet.size < num) {
    const randomIdx = ~~(Math.random() * jsonData.length);
    const item = jsonData[randomIdx];
    resSet.add(item);
  }

  return Array.from(resSet.values());
};

// async function getMetadata(path: string) {
// 	const metadata = await sharp(path).metadata();
// 	console.log(metadata);
// }

const generatePics = async (coworkers: Coworker[]) => {
  const jobs: Promise<string>[] = [];
  coworkers.forEach(({ imagePortraitUrl }) => {
    const formattedName = imagePortraitUrl?.split("/").at(-1);
    // No name, no pic
    if (!formattedName) return;

    jobs.push(generatePic(imagePortraitUrl, formattedName));
  });

  return Promise.all(jobs);
};
const generatePic = (url: string, name: string) => {
  fs.mkdirSync(TEMP_PROCESSED, { recursive: true });

  const outputPath = getProcessedFilePath(name);
  const sharpStream = sharp();
  const result = makeSilhouette(sharpStream, outputPath);
  return new Promise<string>((resolve, reject) => {
    https.get(url, (response) => {
      try {
        response.pipe(sharpStream);
        result.then(() => resolve(name));
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
};

export const getHeadPics = async () => {
  const files = (await getCachedFiles()) || [];
  if (files.length > cache_num) {
    const picks = pickRandoms(files, num);
    console.info("using cached images");
    return picks;
  }

  const randomSet = getRandomFromCache();
  const results = await generatePics(randomSet);

  console.info("using newly generated images");
  return results;
};
