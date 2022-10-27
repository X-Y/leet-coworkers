import { useState, useEffect } from "react";
import {
  Radio,
  Center,
  Stack,
  MediaQuery,
  Box,
  Space,
  Progress,
} from "@mantine/core";

import { Entry, Answer, GAME_ACTIONS } from "../../interfaces/Game";
import { Coworker as CoworkerModel } from "../../interfaces/CoworkerModel";
import type {
  GameDispatch,
  GameState,
} from "../../reducers/gameReducer/gameReducer";

import Coworker from "../../components/Coworker/Coworker";

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

interface PlayStageProps {
  gameState: GameState;
  gameDispatch: GameDispatch;
}
const PlayStage: React.FC<PlayStageProps> = ({ gameState, gameDispatch }) => {
  const { entries } = gameState;

  const [answers, setAnswers] = useState([] as string[]);
  const [current, setCurrent] = useState(0);

  const setAnswer = (value: string) => {
    setAnswers((prev) => [...prev, value]);
    setCurrent((prev) => prev + 1);
  };

  const onPlayDone = (answers: string[]) => {
    const [score, correctedAnswers] = calculateScore(
      answers,
      gameState.entries
    );
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

  const currentCoworker = entries[Math.min(current, entries.length - 1)];
  const { options, imagePortraitUrl } = currentCoworker;
  const coworker = { imagePortraitUrl } as CoworkerModel;

  const progress = (current / entries.length) * 100;
  console.log(progress);

  return (
    <Stack
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: "2vh 0 0 0",
      }}
    >
      <Progress
        sx={{ width: "90%", maxWidth: "40rem", marginBottom: "6vh" }}
        value={progress + 1}
        color={"leetGreen"}
      />

      <MediaQuery
        largerThan={"sm"}
        styles={{
          width: "20rem",
        }}
      >
        <Box
          sx={{
            width: "20rem",
          }}
        >
          <Coworker {...coworker} />
        </Box>
      </MediaQuery>
      <Space h="xl" />
      <Center>
        <Radio.Group
          key={current}
          orientation="vertical"
          name="quiz"
          onChange={setAnswer}
          sx={(theme) => ({ label: { fontSize: "30px" } })}
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
      </Center>
    </Stack>
  );
};

export default PlayStage;
