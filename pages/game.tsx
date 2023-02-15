import { useContext, useEffect } from "react";
import type { NextPage, GetServerSideProps } from "next";
import { useQuery } from "react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useActor } from "@xstate/react";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import type { Coworker } from "../interfaces/CoworkerModel";
import { GAME_STATES } from "../interfaces/Game";

import { coworkersApi } from "../lib/frontendApi";

import { useFilter } from "../hooks/useFilter";
import { useIdbGameSetting } from "../hooks/useIdbGameSetting";

import {
  FILTER_BY,
  FilterContext,
} from "../contexts/FilterContext/FilterContext";
import GameContextProvider from "../contexts/GameXstateContext/GameXstateContextProvider";
import GameXstateContext from "../contexts/GameXstateContext/GameXstateContext";

import PlayStage from "../containers/PlayStage/PlayStage";
import ResultStage from "../containers/ResultStage/ResultStage";
import MemoryStage from "../containers/MemoryStage/MemoryStage";
import ConfigStage from "../containers/ConfigStage/ConfigStage";
import SettingsPage from "../containers/SettingsPage/SettingsPage";
import StatsStage from "../containers/StatsStage/StatsStage";
import HighScoreStage from "../containers/HighScoreStage/HighScoreStage";
import LoginStage from "../containers/LoginStage/LoginStage";
import ModeSelectPage from "../containers/ModeSelectPage/ModeSelectPage";

import GameBackground from "../components/GameBackground/GameBackground";

import { authOptions } from "./api/auth/[...nextauth]";

const Game: NextPage = () => {
  const { data: session } = useSession();
  const { setFilterBy } = useContext(FilterContext);
  const gameService = useContext(GameXstateContext);
  const [current, send] = useActor(gameService.gameService);
  const disableOAuth = useIdbGameSetting("disableOAuth");

  useEffect(() => {
    setFilterBy(FILTER_BY.CITY);
  }, []);

  const isAuthenticated = disableOAuth || !!session;

  const { status, data, error, isFetching, remove } = useQuery<Coworker[]>(
    "getCoworkers",
    coworkersApi,
    {
      staleTime: 60000,
      enabled: isAuthenticated,
    }
  );

  if (!isAuthenticated) {
    remove();
  }

  let resData = data;
  resData = useFilter(resData);

  return (
    <GameBackground>
      {!resData && <div style={{ position: "fixed" }}>Loading...</div>}
      <AnimatePresence mode="wait">
        {current.matches("mainFlow.login") && (
          <motion.div key={"mainFlow.login"}>
            <LoginStage />
          </motion.div>
        )}

        {current.matches("mainFlow.configStage.main") && (
          <motion.div key={"mainFlow.configStage.main"}>
            <ConfigStage />
          </motion.div>
        )}

        {current.matches("mainFlow.configStage.modes") && (
          <motion.div key={"mainFlow.configStage.modes"}>
            <ModeSelectPage />
          </motion.div>
        )}

        {current.matches("mainFlow.memoryStage") && (
          <motion.div key={GAME_STATES.MEMORY}>
            <MemoryStage />
          </motion.div>
        )}

        {current.matches("mainFlow.playStage") && (
          <motion.div key={GAME_STATES.PLAY}>
            <PlayStage />
          </motion.div>
        )}

        {current.matches("mainFlow.highScoreStage") && (
          <>
            <ResultStage />
          </>
        )}

        {current.matches("overlays.settings") && (
          <motion.div key={"overlays.settings"}>
            <SettingsPage />
          </motion.div>
        )}

        {current.matches("overlays.statsStage") && (
          <>
            <StatsStage />
          </>
        )}

        {current.matches("overlays.leaderBoardStage") && (
          <>
            <HighScoreStage />
          </>
        )}
      </AnimatePresence>
    </GameBackground>
  );
};

const GameWithXstateContext: NextPage = () => {
  return (
    <GameContextProvider>
      <Game />
    </GameContextProvider>
  );
};

export default GameWithXstateContext;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session =
    (await getServerSession(context.req, context.res, authOptions)) || {};

  return { props: { session } };
};
