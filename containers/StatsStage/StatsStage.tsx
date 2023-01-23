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
import { motion, MotionConfig, Variants } from "framer-motion";
import { useQuery } from "react-query";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { GAME_ACTIONS, GAME_OVERLAY_ACTIONS } from "../../interfaces/Game";
import { Coworker } from "../../interfaces/CoworkerModel";
import { GameStepProps } from "../../interfaces/GameStepProps";

import { coworkersApi } from "../../lib/frontendApi";
import { initGameDB } from "../../lib/gameDB";

import GameStatsTile from "../../components/GameStatsTile/GameStatsTile";
import { MotionBottomBar } from "../../components/BottomBar/BottomBar";
import TitleText from "../../components/TitleText/TitleText";
import GameXstateContext from "../../contexts/GameXstateContext/GameXstateContext";
import { useActor } from "@xstate/react";

const itemVariants: Variants = {
  out: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
};

const ResultStage = () => {
  const gameService = useContext(GameXstateContext);
  const [, send] = useActor(gameService.gameService);

  const [gameStat, setGameStat] = useState<[Coworker, number, number][]>([]);

  const onGameBackClick = () => {
    send({ type: GAME_ACTIONS.GO_BACK });
  };

  const { data } = useQuery<Coworker[]>("getCoworkers", coworkersApi, {
    staleTime: 60000,
  });

  const getStats = async () => {
    if (!data) {
      throw "shouldn't be here";
    }
    const db = await initGameDB();

    const res = await db.getAllMisses();

    const stats = res
      .map(({ email, misses, hits }) => {
        const coworker = data.find(
          ({ email: email_coworker }) => email === email_coworker
        );
        return [coworker, misses, hits] as [Coworker, number, number];
      })
      .filter((one) => !!one);

    setGameStat(stats);
  };

  const clearStats = async () => {
    const db = await initGameDB();
    const doRemove = window.confirm(
      "Are you sure you want to remove the stats?"
    );
    if (!doRemove) {
      return;
    }
    const res = await db.clearStats();

    getStats();
  };

  useEffect(() => {
    if (data) {
      getStats();
    }
  }, [data]);

  const top10Hits = useMemo(
    () =>
      gameStat
        .sort(([, , hitsA], [, , hitsB]) => hitsB - hitsA)
        .filter(([, , hits]) => hits !== 0)
        .slice(0, 10),
    [gameStat]
  );
  const top10Misses = useMemo(
    () =>
      gameStat
        .sort(([, missesA], [, missesB]) => missesB - missesA)
        .filter(([, misses]) => misses !== 0)
        .slice(0, 10),
    [gameStat]
  );

  return (
    <motion.div initial={"out"} animate={"in"}>
      <MotionConfig transition={{ staggerChildren: 0.2 }}>
        <Stack style={{ minHeight: "100vh" }}>
          <motion.div variants={itemVariants}>
            <TitleText>Top 10 Misses</TitleText>
          </motion.div>
          <motion.div variants={itemVariants}>
            {top10Misses.length ? (
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
                  {top10Misses.map(([coworker, misses, hits], idx) => (
                    <GameStatsTile
                      key={idx}
                      coworker={coworker}
                      misses={misses}
                    />
                  ))}
                </Box>
              </MediaQuery>
            ) : (
              <TitleText order={2} size={30}>
                Keep Playing to get stats!{" "}
              </TitleText>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <TitleText>Top 10 Hits</TitleText>
          </motion.div>
          <motion.div variants={itemVariants}>
            {top10Hits.length ? (
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
                  {top10Hits.map(([coworker, misses, hits], idx) => (
                    <GameStatsTile key={idx} coworker={coworker} hits={hits} />
                  ))}
                </Box>
              </MediaQuery>
            ) : (
              <TitleText order={2} size={30}>
                Keep Playing to get stats!{" "}
              </TitleText>
            )}
          </motion.div>
        </Stack>
      </MotionConfig>
      <MotionBottomBar variants={itemVariants} transition={{ delay: 0.4 }}>
        <Button color="red" size="lg" onClick={clearStats}>
          Clean Stats
        </Button>
        <Button
          color="leetPurple"
          variant="light"
          size="lg"
          onClick={onGameBackClick}
        >
          Back
        </Button>
      </MotionBottomBar>
    </motion.div>
  );
};

export default ResultStage;
