import https from "https";
import fs from "fs";
import sharp from "sharp";
import cacheData from "memory-cache";

import { Coworker } from "../interfaces/CoworkerModel";

import makeSilhouette from "./makeSilhouette";
import headImgCache from "./headImgCache";

const API_URL = process.env.API_URL;
const ENDPOINT = process.env.API_ENDPOINT_EMPLOYEE;

const num = 5;
const cache_num = 15;

export const HEAD_IMG_CACHE_TAG = "head-img-cache/";

const getCachedFiles = () => {
  try {
    /*return cacheData.keys().reduce((prev, curr: string) => {
      if (curr.startsWith(HEAD_IMG_CACHE_TAG)) {
        return [...prev, curr.split("/")[1]];
      }
      return prev;
    }, [] as string[]);*/
    return headImgCache.keys();
  } catch (err) {
    console.error("Error occurred while reading Buffer!", err);
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
  const stringData: string | undefined = cacheData.get(leetCoworkerUrl);
  if (!stringData) {
    throw "Coworker data not cached yet";
  }

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
  const outputPath = HEAD_IMG_CACHE_TAG + name;
  const sharpStream = sharp();
  const result = makeSilhouette(sharpStream, "");
  return new Promise<string>((resolve, reject) => {
    https.get(url, (response) => {
      try {
        response.pipe(sharpStream);
        result.then((data) => {
          headImgCache.set(name, data, 24 * 1000 * 60 * 60);
          resolve(name);
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
};

export const getHeadPics = async () => {
  const files = getCachedFiles() || [];
  if (files.length > cache_num) {
    const picks = pickRandoms(files, num);
    console.info("using cached images");
    return picks;
  }

  try {
    const randomSet = getRandomFromCache();
    const results = await generatePics(randomSet);

    console.info("using newly generated images");
    return results;
  } catch (e) {
    console.error(e);
    return [];
  }
};
