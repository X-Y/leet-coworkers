import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useContext } from "react";

import { GlobalStoreContext } from "../../contexts/GlobalStoreContext/GlobalStoreContext";

export const GoogleIdentity = () => {
  const { oAuthCredential, setOAuthCredential } =
    useContext(GlobalStoreContext);

  const onLogoutClick = () => {
    googleLogout();
    setOAuthCredential("");
  };
  if (oAuthCredential) {
    return (
      <div>
        <button onClick={onLogoutClick}>logout</button>
      </div>
    );
  }
  return (
    <GoogleLogin
      useOneTap
      auto_select={true}
      onSuccess={(credentialResponse) => {
        setOAuthCredential(credentialResponse.credential || "");
      }}
    />
  );
};
