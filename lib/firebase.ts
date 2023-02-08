import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

import { configs } from "../firebaseConfigs";
import { Regions } from "../reducers/gameReducer/gameReducer";

let firebaseApp: FirebaseApp;
let database: Database;

export const getRealtimeDatabase = () => {
  if (!firebaseApp) firebaseApp = initializeApp(configs);
  if (!database) database = getDatabase(firebaseApp);

  return database;
};

export const getRegionString = (region: Regions) => {
  return region.toLowerCase().replaceAll(" ", "");
};
