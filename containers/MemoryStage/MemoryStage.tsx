import { Box, Button, Container } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { useContext, useEffect, useState, useRef } from "react";

import type { Coworker } from "../../interfaces/CoworkerModel";
import { GAME_ACTIONS, Entry } from "../../interfaces/Game";

import { coworkersApi } from "../../lib/frontendApi";
import { initGameDB } from "../../lib/gameDB";

import type {
  GameDispatch,
  GameState,
  regionType,
} from "../../reducers/gameReducer/gameReducer";

import { FILTER_BY } from "../../contexts/FilterContext/FilterContext";

import CoworkersList from "../../components/CoworkersList/CoworkersList";
import BottomBar from "../../components/BottomBar/BottomBar";
import Spinner from "../../components/Spinner/Spinner";

import { filterData } from "../../hooks/useFilter";
import useAuditGameSet from "./useAuditGameSet";

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
  const spinnerTimerIdRef = useRef<NodeJS.Timeout>();
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState<number>();
  const [entries, setEntries] = useState<Entry[]>([]);

  const cleanUpGameSet = (brokens: string[]) => {
    setEntries((prev) =>
      prev
        .filter(({ imagePortraitUrl }) => !brokens.includes(imagePortraitUrl))
        .slice(0, gameState.amount)
    );

    spinnerTimerIdRef.current = setTimeout(() => {
      setLoading(false);
    }, 1000);

    window.scrollTo(0, 0);
  };

  const {
    reset,
    audit,
    setAmount: setAuditAmount,
  } = useAuditGameSet(cleanUpGameSet);

  const { data } = useQuery<Coworker[]>("getCoworkers", coworkersApi, {
    staleTime: 60000,
  });

  let resData = data;

  const onImageLoadError = (e: Event) => {
    const target = e.target as HTMLImageElement | null;
    const brokenSrc = target?.src;
    audit(brokenSrc);

    target?.removeEventListener("load", onImageLoadSuccess);
    target?.removeEventListener("error", onImageLoadError);
  };
  const onImageLoadSuccess = (e: Event) => {
    const target = e.target as HTMLImageElement | null;
    audit();

    target?.removeEventListener("load", onImageLoadSuccess);
    target?.removeEventListener("error", onImageLoadError);
  };

  const generateGameSet = () => {
    const resDataConst = resData;
    if (!resDataConst) return;

    reset();
    setLoading(true);
    const { amount, confusions, region } = gameState;

    const regionFilterString = getRegionFilterString(region);
    const entries: Entry[] = (
      filterData(resDataConst, FILTER_BY.CITY, regionFilterString) || []
    )
      .filter((one) => !!one.imagePortraitUrl)
      .sort(() => 0.5 - Math.random())
      // Add some backups for broken images
      .slice(0, amount + Math.min(amount * 0.1, 2))
      .map((one) => {
        const { imagePortraitUrl } = one;
        const img = new Image();
        img.src = imagePortraitUrl;

        img.addEventListener("error", onImageLoadError);
        img.addEventListener("load", onImageLoadSuccess);

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

    setAuditAmount(entries.length);

    setTimestamp(Date.now());
    setEntries(entries);
  };

  useEffect(() => {
    generateGameSet();
    return () => {
      clearTimeout(spinnerTimerIdRef.current);
    };
  }, []);

  const onGameStartClick = () => {
    gameDispatch({
      type: GAME_ACTIONS.START,
      payload: { entries },
    });
  };

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
