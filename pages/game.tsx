import { useContext, useEffect, useReducer, useState } from "react";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import { AnimatePresence, motion } from "framer-motion";

import type { Coworker } from "../interfaces/CoworkerModel";
import { GAME_STATES, GAME_ACTIONS } from "../interfaces/Game";

import { coworkersApi } from "../lib/frontendApi";
import useUndoReducer from "../lib/useUndoReducer";

import {
  FILTER_BY,
  FilterContext,
} from "../contexts/FilterContext/FilterContext";

import {
  gameStateReducer,
  HistoryType,
  iniGameState,
} from "../reducers/gameReducer/gameReducer";

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
  const [gameState, gameDispatch, history] = useUndoReducer(
    gameStateReducer,
    iniGameState
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

  return (
    <GameBackground>
      {!resData && <div style={{ position: "fixed" }}>Loading...</div>}
      <AnimatePresence mode="wait">
        {gameState.step === GAME_STATES.MENU && (
          <motion.div key={GAME_STATES.MENU}>
            <ConfigStage gameDispatch={gameDispatch} gameState={gameState} />
          </motion.div>
        )}

        {gameState.step === GAME_STATES.MEMORY && (
          <motion.div key={GAME_STATES.MEMORY}>
            <MemoryStage gameDispatch={gameDispatch} gameState={gameState} />
          </motion.div>
        )}

        {gameState.step === GAME_STATES.PLAY && (
          <motion.div key={GAME_STATES.PLAY}>
            <PlayStage gameDispatch={gameDispatch} gameState={gameState} />
          </motion.div>
        )}

        {gameState.step === GAME_STATES.RESULT && (
          <>
            <ResultStage
              gameDispatch={gameDispatch}
              gameState={gameState}
              history={history}
            />
          </>
        )}

        {gameState.step === GAME_STATES.STATS && (
          <>
            <StatsStage gameDispatch={gameDispatch} gameState={gameState} />
          </>
        )}

        {gameState.step === GAME_STATES.HIGHSCORE && (
          <>
            <HighScoreStage gameDispatch={gameDispatch} gameState={gameState} />
          </>
        )}
      </AnimatePresence>
    </GameBackground>
  );
};

export default Game;
