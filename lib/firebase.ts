import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

import { configs } from "../firebaseConfigs";

let firebaseApp: FirebaseApp;
let database: Database;

export const getRealtimeDatabase = () => {
  if (!firebaseApp) firebaseApp = initializeApp(configs);
  if (!database) database = getDatabase(firebaseApp);

  return database;
};
