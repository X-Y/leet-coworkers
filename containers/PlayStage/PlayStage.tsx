import { useState, useEffect } from "react";
import { Radio, Center, Stack, MediaQuery, Box, Space } from "@mantine/core";

import { Entry, Answer, GAME_ACTIONS } from "../../interfaces/Game";
import { CoworkerModel } from "../../interfaces/CoworkerModel";
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

  return (
    <Center>
      <Stack>
        <MediaQuery
          largerThan={"sm"}
          styles={{
            width: "20rem",
            margin: "10rem 0 0 0",
          }}
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Coworker {...coworker} />
          </Box>
        </MediaQuery>
        <Space h="xl" />
        <Center>
          <Radio.Group
            orientation="vertical"
            name="quiz"
            onChange={setAnswer}
            sx={(theme) => ({ label: { fontSize: "30px" } })}
          >
            {options.map((option, idx) => (
              <Radio key={current + "_" + idx} value={option} label={option} />
            ))}
          </Radio.Group>
        </Center>
      </Stack>
    </Center>
  );
};

export default PlayStage;
