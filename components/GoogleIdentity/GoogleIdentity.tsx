import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import { MainButton } from "../Button/MainMenuButtons";

interface GoogleIdentityProps {
  onSuccess?: () => void;
}

export const GoogleIdentity = ({ onSuccess }: GoogleIdentityProps) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      onSuccess && onSuccess();
    }
  }, [session, onSuccess]);

  return (
    <MainButton onClick={() => (session ? signOut() : signIn("google"))}>
      Sign {session ? "out" : "in"}
    </MainButton>
  );
};
