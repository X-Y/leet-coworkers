import { useContext, useEffect, useReducer, useState } from "react";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import { AnimatePresence, motion } from "framer-motion";

import type { Coworker } from "../interfaces/CoworkerModel";
import { GAME_STATES, GAME_OVERLAY_STATES } from "../interfaces/Game";

import { coworkersApi } from "../lib/frontendApi";

import {
  FILTER_BY,
  FilterContext,
} from "../contexts/FilterContext/FilterContext";

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

const Game: NextPage = () => {
  const { setFilterBy } = useContext(FilterContext);
  const [gameState, gameDispatch] = useReducer(gameStateReducer, iniGameState);
  const [gameOverlayState, gameOverlayDispatch] = useReducer(
    gameOverlayStateReducer,
    iniGameOverlayState
  );

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

  const gameStep =
    gameOverlayState.step === GAME_OVERLAY_STATES.NONE
      ? gameState.step
      : gameOverlayState.step;

  return (
    <GameBackground>
      {!resData && <div style={{ position: "fixed" }}>Loading...</div>}
      <AnimatePresence mode="wait">
        {gameStep === GAME_STATES.MENU && (
          <motion.div key={GAME_STATES.MENU}>
            <ConfigStage
              gameDispatch={gameDispatch}
              gameOverlayDispatch={gameOverlayDispatch}
              gameState={gameState}
            />
          </motion.div>
        )}

        {gameStep === GAME_STATES.MEMORY && (
          <motion.div key={GAME_STATES.MEMORY}>
            <MemoryStage gameDispatch={gameDispatch} gameState={gameState} />
          </motion.div>
        )}

        {gameStep === GAME_STATES.PLAY && (
          <motion.div key={GAME_STATES.PLAY}>
            <PlayStage gameDispatch={gameDispatch} gameState={gameState} />
          </motion.div>
        )}

        {gameStep === GAME_STATES.RESULT && (
          <>
            <ResultStage
              gameDispatch={gameDispatch}
              gameOverlayDispatch={gameOverlayDispatch}
              gameState={gameState}
            />
          </>
        )}

        {gameStep === GAME_OVERLAY_STATES.STATS && (
          <>
            <StatsStage
              gameDispatch={gameDispatch}
              gameOverlayDispatch={gameOverlayDispatch}
              gameState={gameState}
            />
          </>
        )}

        {gameStep === GAME_OVERLAY_STATES.HIGHSCORE && (
          <>
            <HighScoreStage
              gameDispatch={gameDispatch}
              gameOverlayDispatch={gameOverlayDispatch}
              gameState={gameState}
            />
          </>
        )}
      </AnimatePresence>
    </GameBackground>
  );
};

export default Game;
