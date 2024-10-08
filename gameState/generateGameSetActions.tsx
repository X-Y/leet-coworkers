import { Coworker } from "../interfaces/CoworkerModel";
import { Entry } from "../interfaces/Game";

import { Regions, gameCities } from "../reducers/gameReducer/gameReducer";

import { filterData } from "../hooks/useFilter";

import { FILTER_BY } from "../contexts/FilterContext/FilterContext";

const getRegionFilterString = (region: Regions) => {
  const regionData = gameCities.find(([label]) => region === label);
  if (!regionData) throw "unknown region" + region;

  return regionData[1];
};

export const generateGameSet = (
  data: Coworker[],
  amount: number,
  confusions: number,
  region: Regions
) => {
  let entries: Entry[] = [];
  let audited: number = 0;
  // Add some backups for potential broken images
  const amountPlus = amount + Math.max(amount * 0.1, 2);

  const regionFilterString = getRegionFilterString(region);
  const preliminaries: Coworker[] = (
    filterData(data, FILTER_BY.CITY, regionFilterString) || []
  )
    .filter((one) => !!one.imagePortraitUrl)
    .sort(() => 0.5 - Math.random())
    .slice(0, amountPlus);

  return new Promise<Entry[]>((resolve, reject) => {
    let auditDone = false;
    const audit = (src?: string) => {
      if (auditDone) return;

      if (src) {
        const valid = preliminaries.find((one) => one.imagePortraitUrl === src);
        if (!valid) throw "a valid image should always exist";

        const options = createConfusions(valid, confusions, data);

        // avoid adding broken options
        if (options.length === confusions) {
          entries.push({
            ...valid,
            options,
          });
        }
      }

      audited++;
      if (
        audited >= preliminaries.length ||
        entries.length >= Math.min(preliminaries.length, amount)
      ) {
        auditDone = true;
        resolve(entries);
      }
    };
    const onImageLoadError = (e: ErrorEvent) => {
      const target = e.target as HTMLImageElement | null;
      if (!target) throw "should not be null";
      audit();

      target.removeEventListener("load", onImageLoadSuccess);
      target.removeEventListener("error", onImageLoadError);
    };
    const onImageLoadSuccess = (e: Event) => {
      const target = e.target as HTMLImageElement | null;
      if (!target) throw "should not be null";
      audit(target.src);

      target.removeEventListener("load", onImageLoadSuccess);
      target.removeEventListener("error", onImageLoadError);
    };

    preliminaries.forEach((one) => {
      const { imagePortraitUrl } = one;

      const img = new Image();
      img.src = imagePortraitUrl;

      img.addEventListener("error", onImageLoadError);
      img.addEventListener("load", onImageLoadSuccess);
    });
  });
};

const createConfusions = (
  valid: Coworker,
  numConfusionsMax: number,
  data: Coworker[]
) => {
  const { name: realName, office: validOffice } = valid;

  const dataByOffice = data.filter(
    ({ office }) =>
      office?.toLocaleLowerCase() === validOffice?.toLocaleLowerCase()
  );
  const numConfusions = Math.min(dataByOffice.length, numConfusionsMax);

  // Fisher-Yates shuffle to only randomize the necessary numbers
  for (
    let i = dataByOffice.length;
    i > dataByOffice.length - numConfusions;
    i--
  ) {
    const idxToSwap = Math.floor(Math.random() * i);
    const temp = dataByOffice[i - 1];
    dataByOffice[i - 1] = dataByOffice[idxToSwap];
    dataByOffice[idxToSwap] = temp;
  }

  const candidates = dataByOffice
    .slice(-numConfusions)
    .map(({ name }) => name)
    .filter((name) => name !== realName)
    .concat(realName);

  // realName is always added to the end, so 1st element is safe to remove
  if (candidates.length > numConfusions) candidates.shift();

  return candidates.sort(() => 0.5 - Math.random());
};
