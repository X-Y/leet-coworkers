import { useContext, useEffect, useReducer, useState } from "react";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import { AnimatePresence, motion } from "framer-motion";

import type { Coworker } from "../interfaces/CoworkerModel";
import { GAME_STATES } from "../interfaces/Game";

import { coworkersApi } from "../lib/frontendApi";

import {
  FILTER_BY,
  FilterContext,
} from "../contexts/FilterContext/FilterContext";

import {
  gameStateReducer,
  iniGameState,
} from "../reducers/gameReducer/gameReducer";

import PlayStage from "../containers/PlayStage/PlayStage";
import ResultStage from "../containers/ResultStage/ResultStage";
import MemoryStage from "../containers/MemoryStage/MemoryStage";
import ConfigStage from "../containers/ConfigStage/ConfigStage";

import styles from "../styles/Home.module.scss";
import { useSort } from "../hooks/useSort";
import { useFilter } from "../hooks/useFilter";
import GameBackground from "../components/GameBackground/GameBackground";

const Game: NextPage = () => {
  const { setFilterBy, setFilterValue } = useContext(FilterContext);
  const [gameState, gameDispatch] = useReducer(gameStateReducer, iniGameState);

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
  resData = useSort(resData);

  return (
    <GameBackground>
      {!resData && <div style={{ position: "fixed" }}>Loading...</div>}
      <AnimatePresence exitBeforeEnter>
        {gameState.step === GAME_STATES.MENU && (
          <motion.div key={GAME_STATES.MENU}>
            <ConfigStage
              resData={resData}
              gameDispatch={gameDispatch}
              gameState={gameState}
            />
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
            <ResultStage gameDispatch={gameDispatch} gameState={gameState} />
          </>
        )}
      </AnimatePresence>{" "}
    </GameBackground>
  );
};

export default Game;
