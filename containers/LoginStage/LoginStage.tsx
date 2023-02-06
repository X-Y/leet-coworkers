import { motion, Variants } from "framer-motion";
import { Center, MediaQuery, Select, Stack } from "@mantine/core";
import { useCallback, useContext, useEffect } from "react";
import { useActor } from "@xstate/react";

import GameXstateContext from "../../contexts/GameXstateContext/GameXstateContext";

import FlagText from "../../components/FlagText/FlagText";
import { GoogleIdentity } from "../../components/GoogleIdentity/GoogleIdentity";

import { useIdbGameSetting } from "../../hooks/useIdbGameSetting";
import { GAME_ACTIONS } from "../../interfaces/Game";

const variantsTitle: Variants = {
  enter: {
    y: -200,
    opacity: 0,
  },
  ready: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -200,
    opacity: 0,
  },
};

export const LoginStage = () => {
  const gameService = useContext(GameXstateContext);
  const [, send] = useActor(gameService.gameService);
  const disableOAuth = useIdbGameSetting("disableOAuth");

  const loggedIn = useCallback(() => {
    send({ type: GAME_ACTIONS.LOGGED_IN });
  }, [send]);

  useEffect(() => {
    if (disableOAuth) {
      loggedIn();
    }
  }, [disableOAuth, loggedIn]);

  return (
    <Center>
      <motion.div
        initial="enter"
        animate="ready"
        exit="exit"
        variants={{
          exit: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
        transition={{
          staggerChildren: 0.2,
        }}
      >
        <MediaQuery largerThan={"sm"} styles={{ marginTop: "8rem" }}>
          <Stack sx={{ padding: "0 0.5rem" }}>
            <motion.div variants={variantsTitle}>
              <FlagText size={60} weight={900}>
                THE GUESSING GAME
              </FlagText>
              <Center>
                <GoogleIdentity onSuccess={loggedIn} />
              </Center>
            </motion.div>
          </Stack>
        </MediaQuery>
      </motion.div>
    </Center>
  );
};

export default LoginStage;
