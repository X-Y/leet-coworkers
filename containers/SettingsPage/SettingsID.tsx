import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, Flex, Stack, Text } from "@mantine/core";

import { SubButton } from "../../components/Button/MainMenuButtons";

export const SettingsID = () => {
  const { data: session } = useSession();

  const isSignedIn = !!session?.user;

  return (
    <Stack>
      <Text color={"white"}>
        {isSignedIn ? "Logged in as: " : "Requires 1337 sign-in to play"}
      </Text>
      <Flex align={"center"} gap={"sm"}>
        {isSignedIn ? (
          <>
            <Avatar
              radius={"xl"}
              size={"md"}
              src={session.user?.image}
              alt={"user portrait"}
              imageProps={{ referrerPolicy: "no-referrer" }}
            />
            <Text color={"white"}>{session.user?.name}</Text>
            <SubButton onClick={() => signOut()}> Sign out</SubButton>
          </>
        ) : (
          <SubButton onClick={() => signIn()}>Sign in</SubButton>
        )}
      </Flex>
    </Stack>
  );
};
