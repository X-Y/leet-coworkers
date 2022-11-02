import {
  Box,
  Button,
  Stack,
  Grid,
  MediaQuery,
  Text,
  Center,
  Title,
  Transition,
} from "@mantine/core";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useQuery } from "react-query";

import { GAME_ACTIONS } from "../../interfaces/Game";
import { Coworker } from "../../interfaces/CoworkerModel";
import type {
  GameDispatch,
  GameState,
} from "../../reducers/gameReducer/gameReducer";

import { coworkersApi } from "../../lib/frontendApi";
import { initGameDB } from "../../lib/gameDB";

import GameStatsTile from "../../components/GameStatsTile/GameStatsTile";
import BottomBar from "../../components/BottomBar/BottomBar";
import FlagText from "../../components/FlagText/FlagText";

import { useEffect, useRef, useState } from "react";

interface ResultStageProps {
  gameState: GameState;
  gameDispatch: GameDispatch;
}

const ResultStage: React.FC<ResultStageProps> = ({
  gameState,
  gameDispatch,
}) => {
  const { entries, answers, score } = gameState;
  const [gameStat, setGameStat] = useState<[Coworker, number, number][]>([]);

  const onGameMenuClick = () => {
    gameDispatch({ type: GAME_ACTIONS.RESTART });
  };
  const onGameRestartClick = () => {
    gameDispatch({ type: GAME_ACTIONS.CONFIGS_DONE });
  };

  const { data } = useQuery<Coworker[]>("getCoworkers", coworkersApi, {
    staleTime: 60000,
  });

  const getStats = async () => {
    if (!data) {
      throw "shouldn't be here";
      return;
    }
    const db = await initGameDB();

    const res = await db.getAllMisses();

    console.log(res);

    const stats = res
      .reverse()
      .map(({ email, misses, hits }) => {
        const coworker = data.find(
          ({ email: email_coworker }) => email === email_coworker
        );
        return [coworker, misses, hits] as [Coworker, number, number];
      })
      .filter((one) => !!one);

    setGameStat(stats);
  };

  useEffect(() => {
    if (data) {
      getStats();
    }
  }, [data]);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Box>
          <MediaQuery
            largerThan="xs"
            styles={{
              gridTemplateColumns: "repeat(auto-fill, 300px)",
              gap: "2rem",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "grid",
                padding: "2rem",
                marginBottom: "2rem",
                gap: "2rem",
              }}
            >
              {gameStat.map(([coworker, misses, hits], idx) => (
                <GameStatsTile
                  key={idx}
                  coworker={coworker}
                  hits={hits}
                  misses={misses}
                />
              ))}
            </Box>
          </MediaQuery>
          <BottomBar>
            <Button
              color="leetPurple"
              variant="light"
              size="lg"
              onClick={onGameMenuClick}
            >
              Menu
            </Button>
          </BottomBar>
        </Box>
      </motion.div>
    </>
  );
};

export default ResultStage;
