import https from "https";
import sharp from "sharp";

import { Coworker } from "../interfaces/CoworkerModel";

import makeSilhouette from "./makeSilhouette";
import { saveImg, listImgs, getImgUrl } from "./cloudFlareR2";
import { fetchCoworkersApi } from "./backendApi";

const num = 5;
const cache_num = 15;

export const HEAD_IMG_CACHE_TAG = "head-img-cache/";

const getCachedFiles = async () => {
  try {
    const imgs = await listImgs();
    const names = imgs.Contents?.map(({ Key }) => Key as string);
    return names;
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

const getRandomFromCache = async (existing: string[]) => {
  let data: Coworker[];
  try {
    data = await fetchCoworkersApi();
  } catch (e) {
    throw "Coworker data not cached yet";
  }

  const resSet: Set<Coworker> = new Set();

  while (resSet.size < num) {
    const randomIdx = ~~(Math.random() * data.length);
    const item = data[randomIdx];
    resSet.add(item);
  }

  let resArr = Array.from(resSet.values());
  resArr = resArr.filter(({ name }) => !existing.includes(name));

  return resArr;
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
    https.get(url, async (response) => {
      try {
        response.pipe(sharpStream);
        const data = await result;
        const sendResp = await saveImg(name, data);
        resolve(name);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
};

export const getHeadPics = async () => {
  const files = (await getCachedFiles()) || [];
  let picks: string[] = [];
  if (files.length > cache_num) {
    picks = pickRandoms(files, num);
    console.info("using cached images, and generating some more");

    getRandomFromCache(picks)
      .then(generatePics)
      .catch((e) => {
        console.error("Cannot get head pics, ", e);
      });
  } else {
    try {
      const randomsNew = await getRandomFromCache(picks);
      picks = await generatePics(randomsNew);

      console.info("using newly generated images");
    } catch (e) {
      //TODO: Error should be sent to frontend
      console.error(e);
    }
  }

  const signedUrlsPromise = picks.map((one) => getImgUrl(one));
  const signedUrls = Promise.all(signedUrlsPromise);

  return signedUrls;
};
