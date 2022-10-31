import { Box, Button, Container } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { useContext, useEffect, useState } from "react";

import type { Coworker } from "../../interfaces/CoworkerModel";
import { GAME_ACTIONS, Entry } from "../../interfaces/Game";

import { coworkersApi } from "../../lib/frontendApi";

import type {
  GameDispatch,
  GameState,
  regionType,
} from "../../reducers/gameReducer/gameReducer";

import {
  FilterContext,
  FILTER_BY,
} from "../../contexts/FilterContext/FilterContext";

import CoworkersList from "../../components/CoworkersList/CoworkersList";
import BottomBar from "../../components/BottomBar/BottomBar";

import { useFilter, filterData } from "../../hooks/useFilter";

const getRegionFilterString = (region: regionType) => {
  if (typeof region === "string") {
    return region;
  } else {
    return region[1];
  }
};

interface MemoryStageProps {
  gameState: GameState;
  gameDispatch: GameDispatch;
}
const MemoryStage: React.FC<MemoryStageProps> = ({
  gameState,
  gameDispatch,
}) => {
  const { filterValue, setFilterValue } = useContext(FilterContext);

  const [timestamp, setTimestamp] = useState<number>();
  const [entries, setEntries] = useState<Entry[]>([]);

  const { data } = useQuery<Coworker[]>("getCoworkers", coworkersApi, {
    staleTime: 60000,
  });

  let resData = data;

  const generateGameSet = () => {
    const resDataConst = resData;
    if (!resDataConst) return;

    const { amount, confusions, region } = gameState;

    const regionFilterString = getRegionFilterString(region);
    const entries: Entry[] = (
      filterData(resDataConst, FILTER_BY.CITY, regionFilterString) || []
    )
      .filter((one) => !!one.imagePortraitUrl)
      .sort(() => 0.5 - Math.random())
      .slice(0, amount)
      .map((one) => {
        let confuses: string[] = [one.name];
        while (confuses.length < confusions) {
          const confuse =
            resDataConst[Math.round(Math.random() * (resDataConst.length - 1))];
          if (confuses.findIndex((name) => name === confuse.name) === -1) {
            confuses.push(confuse.name);
          }
        }

        const options = confuses.sort(() => 0.5 - Math.random());

        return {
          ...one,
          options,
        };
      });

    setTimestamp(Date.now());
    setEntries(entries);

    window.scrollTo(0, 0);
  };

  useEffect(() => {
    generateGameSet();
  }, []);

  const onGameStartClick = () => {
    gameDispatch({ type: GAME_ACTIONS.START, payload: { entries } });
  };

  return (
    <motion.div initial="closed" animate="open" exit="closed">
      <Box sx={{ padding: "2rem", position: "relative", minHeight: "100vh" }}>
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
    </motion.div>
  );
};

export default MemoryStage;
