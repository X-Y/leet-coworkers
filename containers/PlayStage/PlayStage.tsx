import { useState, useEffect, useContext } from "react";
import {
  Radio,
  Center,
  Stack,
  MediaQuery,
  Box,
  Space,
  Progress,
  ScrollArea,
} from "@mantine/core";
import { AnimatePresence, motion, Variant } from "framer-motion";
import { useActor } from "@xstate/react";

import { Entry, Answer, GAME_ACTIONS } from "../../interfaces/Game";
import { Coworker as CoworkerModel } from "../../interfaces/CoworkerModel";
import { GameStepProps } from "../../interfaces/GameStepProps";

import { initGameDB } from "../../lib/gameDB";

import GameXstateContext from "../../contexts/GameXstateContext/GameXstateContext";

import Coworker from "../../components/Coworker/Coworker";

import { RadioInputAnswers } from "./RadioInputAnswers";
import { TextInputAnswer } from "./TextInputAnswerAlt";

const variantsContainer: Record<string, Variant> = {
  center: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};
const variants: Record<string, Variant> = {
  enter: {
    x: 200,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -100,
    opacity: 0,

    transition: { duration: 0.2, ease: [0.395, 0.005, 1.0, 0.38] },
  },
};

const getTypeNameSetting = async () => {
  const db = await initGameDB();
  const dbTypeNames = await db.getSetting("typeNames");
  console.log(dbTypeNames);
  return dbTypeNames === "true";
};

const PlayStage = () => {
  const gameService = useContext(GameXstateContext);
  const [current, send] = useActor(gameService.gameService);

  const { entries } = current.context;

  const [typeNames, setTypeNames] = useState(false);
  const [answers, setAnswers] = useState([] as string[]);
  const [currentEntry, setCurrentEntry] = useState(0);

  const setAnswer = (value: string) => {
    setAnswers((prev) => [...prev, value]);
    setCurrentEntry((prev) => prev + 1);
  };

  const onPlayDone = (answers: string[]) => {
    send({
      type: GAME_ACTIONS.END,
      payload: { uncorrectedAnswers: answers },
    });
  };
  useEffect(() => {
    if (currentEntry >= entries.length) {
      onPlayDone(answers);
    }
  }, [currentEntry]);

  useEffect(() => {
    (async () => {
      setTypeNames(await getTypeNameSetting());
    })();
  }, []);

  const currentCoworker =
    currentEntry >= entries.length
      ? { options: [], imagePortraitUrl: "", name: "" }
      : entries[currentEntry];
  const { options, imagePortraitUrl, name } = currentCoworker;
  const coworker = { imagePortraitUrl } as CoworkerModel;

  const progress = (currentEntry / entries.length) * 100;

  return (
    <motion.div initial="enter" animate="center" exit="exit">
      <motion.div
        variants={{
          enter: {
            opacity: 0,
          },
          center: {
            opacity: 1,
          },
          exit: {
            opacity: 0,
          },
        }}
      >
        <Box sx={{ padding: "1rem 0 2rem 0" }}>
          <Progress
            sx={{ width: "90%", maxWidth: "40rem", margin: "auto" }}
            value={progress + 1}
            color={"leetGreen"}
          />
        </Box>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          initial="enter"
          animate="center"
          exit="exit"
          key={"play_" + currentEntry}
          variants={variantsContainer}
        >
          <Stack
            justify="space-between"
            align="center"
            sx={{
              width: "100%",
              gap: "5vh",
            }}
          >
            <motion.div variants={variants}>
              <Box
                sx={{
                  width: "20rem",
                }}
              >
                {coworker.imagePortraitUrl !== "" && <Coworker {...coworker} />}
              </Box>
            </motion.div>

            <motion.div variants={variants}>
              {typeNames ? (
                <TextInputAnswer
                  key={currentEntry}
                  name={name}
                  onComplete={setAnswer}
                />
              ) : (
                <RadioInputAnswers
                  onChange={setAnswer}
                  options={options}
                  key={currentEntry}
                />
              )}
            </motion.div>
          </Stack>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default PlayStage;
