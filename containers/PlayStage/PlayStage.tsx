import { useState, useEffect } from "react";
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

import { Entry, Answer, GAME_ACTIONS } from "../../interfaces/Game";
import { Coworker as CoworkerModel } from "../../interfaces/CoworkerModel";
import { GameStepProps } from "../../interfaces/GameStepProps";

import { initGameDB } from "../../lib/gameDB";

import Coworker from "../../components/Coworker/Coworker";

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

const calculateScore = (answersOrig: string[], entries: Entry[]) => {
  let score = 0;
  const result = entries.reduce((prev, curr, idx) => {
    const currentAnswer = answersOrig[idx];
    let isCorrect = false;
    if (curr.name === currentAnswer) {
      score += 1;
      isCorrect = true;
    }

    return [...prev, [currentAnswer, isCorrect] as Answer];
  }, [] as Answer[]);
  return [score, result] as [number, Answer[]];
};

const PlayStage: React.FC<Omit<GameStepProps, "gameOverlayDispatch">> = ({
  gameState,
  gameDispatch,
}) => {
  const { entries } = gameState;

  const [answers, setAnswers] = useState([] as string[]);
  const [current, setCurrent] = useState(0);

  const setAnswer = (value: string) => {
    setAnswers((prev) => [...prev, value]);
    setCurrent((prev) => prev + 1);
  };

  const saveStats = async (answers: Answer[]) => {
    const db = await initGameDB();

    db.saveResults(entries, answers);

    console.log("stat saved");
  };

  const onPlayDone = (answers: string[]) => {
    const [score, correctedAnswers] = calculateScore(
      answers,
      gameState.entries
    );
    saveStats(correctedAnswers);
    gameDispatch({
      type: GAME_ACTIONS.END,
      payload: { score, answers: correctedAnswers },
    });
  };

  useEffect(() => {
    if (current >= entries.length) {
      onPlayDone(answers);
    }
  }, [current]);

  const currentCoworker =
    current >= entries.length
      ? { options: [], imagePortraitUrl: "" }
      : entries[current];
  const { options, imagePortraitUrl } = currentCoworker;
  const coworker = { imagePortraitUrl } as CoworkerModel;

  const progress = (current / entries.length) * 100;

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
          key={"play_" + current}
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
              <Radio.Group
                key={current}
                orientation="vertical"
                name="quiz"
                onChange={setAnswer}
                sx={(theme) => ({
                  flexGrow: 1,
                  label: { fontSize: "30px" },
                })}
              >
                {options.map((option, idx) => (
                  <Radio
                    key={current + "_" + idx}
                    value={option}
                    label={option}
                    styles={(theme) => ({
                      label: {
                        color: theme.colors.leetPurple[0],
                      },
                    })}
                  />
                ))}
              </Radio.Group>
            </motion.div>
          </Stack>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default PlayStage;
