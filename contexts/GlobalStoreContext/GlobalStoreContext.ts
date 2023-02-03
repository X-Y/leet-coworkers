import { createContext } from "react";

export const GlobalStoreContext = createContext({
  oAuthCredential: "",
  setOAuthCredential: (val: string) => {},
});
