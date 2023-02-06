import { useContext, useEffect, useRef, useState } from "react";

import { GlobalStoreContext } from "../../contexts/GlobalStoreContext/GlobalStoreContext";
import Script from "next/script";

interface GoogleIdentityProps {
  onSuccess: () => void;
}

export const GoogleIdentity = ({ onSuccess }: GoogleIdentityProps) => {
  const { oAuthCredential, setOAuthCredential } =
    useContext(GlobalStoreContext);

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCredentialResponse = (credentialResponse: {
    credential: string;
  }) => {
    setOAuthCredential(credentialResponse.credential || "");
    onSuccess();
  };
  useEffect(() => {
    if (!scriptLoaded) return;
    if (!containerRef.current) throw "googleIdentity div not initialized";
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || "",
      auto_select: true,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      theme: "outline",
    });
    window.google.accounts.id.prompt();
  }, [scriptLoaded]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} />
    </>
  );
};
