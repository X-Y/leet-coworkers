import { Box, Button, Container } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { useContext, useEffect, useState, useRef } from "react";

import type { Coworker } from "../../interfaces/CoworkerModel";
import { GAME_ACTIONS, Entry } from "../../interfaces/Game";
import { GameStepProps } from "../../interfaces/GameStepProps";

import { coworkersApi } from "../../lib/frontendApi";
import { initGameDB } from "../../lib/gameDB";

import type {
  GameDispatch,
  GameState,
  Regions,
} from "../../reducers/gameReducer/gameReducer";

import { FILTER_BY } from "../../contexts/FilterContext/FilterContext";

import CoworkersList from "../../components/CoworkersList/CoworkersList";
import BottomBar from "../../components/BottomBar/BottomBar";
import Spinner from "../../components/Spinner/Spinner";

import { filterData } from "../../hooks/useFilter";
import useAuditGameSet from "./useAuditGameSet";
import GameXstateContext from "../../contexts/GameXstateContext/GameXstateContext";
import { useActor } from "@xstate/react";

const getRegionFilterString = (region: Regions) => {
  if (typeof region === "string") {
    return region;
  } else {
    return region[1];
  }
};

const MemoryStage = () => {
  const gameService = useContext(GameXstateContext);
  const [current, send] = useActor(gameService.gameService);

  const spinnerTimerIdRef = useRef<NodeJS.Timeout>();
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState<number>();

  const { data } = useQuery<Coworker[]>("getCoworkers", coworkersApi, {
    staleTime: 60000,
  });

  const generateGameSet = () => {
    if (!data) {
      throw "no data";
    }
    send({
      type: GAME_ACTIONS.GENERATE,
      payload: {
        data,
      },
    });

    setTimestamp(Date.now());
    setLoading(true);

    // spinnerTimerIdRef.current = setTimeout(() => {
    //   setLoading(false);
    // }, 1000);

    window.scrollTo(0, 0);
  };

  useEffect(() => {
    generateGameSet();
    // return () => {
    //   clearTimeout(spinnerTimerIdRef.current);
    // };
  }, []);

  useEffect(() => {
    if (current.context.entries.length) {
      setLoading(false);
    }
  }, [current.context.entries]);

  const onGameStartClick = () => {
    send({
      type: GAME_ACTIONS.START,
    });
  };

  const { entries } = current.context;

  return (
    <motion.div initial="closed" animate="open" exit="closed">
      <AnimatePresence>
        {loading ? (
          <Spinner key="spinner" />
        ) : (
          <>
            <Box
              sx={{ padding: "2rem", position: "relative", minHeight: "100vh" }}
            >
              <CoworkersList key={timestamp} coworkers={entries || []} />
            </Box>
            <BottomBar>
              <Button
                color="leetPurple"
                variant="light"
                size="lg"
                onClick={generateGameSet}
              >
                Shuffle
              </Button>
              <Button color="leetPurple" size="lg" onClick={onGameStartClick}>
                Start!
              </Button>
            </BottomBar>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MemoryStage;
