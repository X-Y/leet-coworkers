import { GlobalStoreContext } from "./GlobalStoreContext";
import { useState, PropsWithChildren } from "react";

export const GlobalStoreContextProvider = ({ children }: PropsWithChildren) => {
  const [oAuthCredential, setOAuthCredential] = useState("");
  const value = {
    oAuthCredential,
    setOAuthCredential,
  };

  return (
    <GlobalStoreContext.Provider value={value}>
      {children}
    </GlobalStoreContext.Provider>
  );
};
