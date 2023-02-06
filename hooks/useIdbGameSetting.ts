import { initGameDB } from "../lib/gameDB";
import { useEffect, useState } from "react";

export const getSetting = async (name: string) => {
  const db = await initGameDB();
  const dbTypeNames = await db.getSetting(name);
  return dbTypeNames === "true";
};

type nameType = "typeNames" | "disableOAuth";

export const useIdbGameSetting = (name: nameType) => {
  const [setting, setSetting] = useState(false);

  useEffect(() => {
    console.log("useIdbGameSetting", name);
    (async () => {
      setSetting(await getSetting(name));
    })();
  }, [name, setSetting]);

  return setting;
};
