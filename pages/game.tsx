import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useActor, useInterpret, useMachine } from "@xstate/react";

import type { Coworker } from "../interfaces/CoworkerModel";
import { GAME_STATES, GAME_OVERLAY_STATES } from "../interfaces/Game";

import { coworkersApi } from "../lib/frontendApi";

import {
  FILTER_BY,
  FilterContext,
} from "../contexts/FilterContext/FilterContext";
import GameContextProvider from "../contexts/GameXstateContext/GameXstateContextProvider";
import GameXstateContext from "../contexts/GameXstateContext/GameXstateContext";

import { gameFlowMachine } from "../gameState/gameFlow";
import {
  gameStateReducer,
  iniGameState,
} from "../reducers/gameReducer/gameReducer";
import {
  gameOverlayStateReducer,
  iniGameOverlayState,
} from "../reducers/gameReducer/gameOverlayReducer";

import PlayStage from "../containers/PlayStage/PlayStage";
import ResultStage from "../containers/ResultStage/ResultStage";
import MemoryStage from "../containers/MemoryStage/MemoryStage";
import ConfigStage from "../containers/ConfigStage/ConfigStage";
import StatsStage from "../containers/StatsStage/StatsStage";
import HighScoreStage from "../containers/HighScoreStage/HighScoreStage";

import { useFilter } from "../hooks/useFilter";
import GameBackground from "../components/GameBackground/GameBackground";
import { InterpreterFrom } from "xstate";

const Game: NextPage = () => {
  const { setFilterBy } = useContext(FilterContext);
  /*const [gameState, gameDispatch] = useReducer(gameStateReducer, iniGameState);
  const [gameOverlayState, gameOverlayDispatch] = useReducer(
    gameOverlayStateReducer,
    iniGameOverlayState
  );*/
  const gameService = useContext(GameXstateContext);
  const [current, send] = useActor(gameService.gameService);

  useEffect(() => {
    setFilterBy(FILTER_BY.CITY);
  }, []);

  const { status, data, error, isFetching } = useQuery<Coworker[]>(
    "getCoworkers",
    coworkersApi,
    {
      staleTime: 60000,
    }
  );

  let resData = data;
  resData = useFilter(resData);

  /*const gameStep =
    gameOverlayState.step === GAME_OVERLAY_STATES.NONE
      ? gameState.step
      : gameOverlayState.step;*/

  return (
    <GameBackground>
      {!resData && <div style={{ position: "fixed" }}>Loading...</div>}
      <AnimatePresence mode="wait">
        {current.matches("mainFlow.configStage") && (
          <motion.div key={GAME_STATES.MENU}>
            <ConfigStage
            /*gameDispatch={gameDispatch}
              gameOverlayDispatch={gameOverlayDispatch}
              gameState={gameState}*/
            />
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
