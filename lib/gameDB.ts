import { DBSchema, openDB } from "idb";
//import { openDB } from "idb/with-async-ittr.js";
import { Coworker } from "../interfaces/CoworkerModel";
import { Answer } from "../interfaces/Game";

interface GameStatsSchema extends DBSchema {
  settings: {
    key: string;
    value: string;
  };
  coworkers: {
    key: string;
    value: Coworker;
  };
  stats: {
    key: string;
    value: {
      email: string;
      misses: number;
      hits: number;
    };
    indexes: {
      "by-misses": number;
      "by-hits": number;
    };
  };
}
export const initGameDB = async () => {
  const db = await openDB<GameStatsSchema>("game-stats", 2, {
    upgrade(db, oldVersion, newVersion) {
      if (oldVersion < 2) {
        db.createObjectStore("settings");
      }

      if (oldVersion < 1) {
        db.createObjectStore("coworkers", {
          keyPath: "email",
        });

        const statsStore = db.createObjectStore("stats", {
          keyPath: "email",
        });
        statsStore.createIndex("by-hits", "hits");
        statsStore.createIndex("by-misses", "misses");
      }
    },
  });

  const saveSetting = async (name: string, value: string) => {
    return (await db).put("settings", value, name);
  };
  const getSetting = async (name: string) => {
    return (await db).get("settings", name);
  };

  const saveCoworker = async (coworkers: Coworker[]) => {
    const tx = db.transaction("coworkers", "readwrite");
    return Promise.all([
      coworkers.map((one) => {
        return tx.store.put(one);
      }),
      tx.done,
    ]);
  };

  const saveResults = async (entries: Coworker[], results: Answer[]) => {
    const tx = db.transaction("stats", "readwrite");

    results.forEach(async ([, hitMiss], idx) => {
      const { email } = entries[idx];
      let rec = await tx.store.get(email);
      if (!rec) {
        rec = { email, hits: 0, misses: 0 };
      }
      if (hitMiss) {
        rec.hits++;
      } else {
        rec.misses++;
      }
      tx.store.put(rec);
    });
  };
  const getAllMisses = async () => {
    return db.getAllFromIndex("stats", "by-misses");
  };
  const clearStats = async () => {
    return db.clear("stats");
  };

  return {
    saveSetting,
    getSetting,
    saveCoworker,
    saveResults,
    getAllMisses,
    clearStats,
  };
};
