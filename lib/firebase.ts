import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

import { configs } from "../firebaseConfigs";
import { regionType } from "../reducers/gameReducer/gameReducer";

let firebaseApp: FirebaseApp;
let database: Database;

export const getRealtimeDatabase = () => {
  if (!firebaseApp) firebaseApp = initializeApp(configs);
  if (!database) database = getDatabase(firebaseApp);

  return database;
};

export const getRegionString = (region: regionType) => {
  return (typeof region === "string" ? region : region[0])
    .toLowerCase()
    .replaceAll(" ", "");
};
