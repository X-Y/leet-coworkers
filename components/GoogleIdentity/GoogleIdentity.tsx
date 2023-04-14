import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import { MainButton } from "../Button/MainMenuButtons";

interface GoogleIdentityProps {
  onSuccess?: () => void;
}

export const GoogleIdentity = ({ onSuccess }: GoogleIdentityProps) => {
  const { data: session } = useSession();

  const isSignedIn = !!session?.user;

  useEffect(() => {
    if (isSignedIn) {
      onSuccess && onSuccess();
    }
  }, [session, onSuccess]);

  return (
    <MainButton onClick={() => (isSignedIn ? signOut() : signIn("google"))}>
      Sign {isSignedIn ? "out" : "in"}
    </MainButton>
  );
};
