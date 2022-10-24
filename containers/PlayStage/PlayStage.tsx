import { useState, useEffect } from "react";
import { Radio } from "@mantine/core";

import { Entry, Answer, GAME_ACTIONS } from "../../interfaces/Game";
import { Coworker } from "../../interfaces/CoworkerModel";
import type {
  GameDispatch,
  GameState,
} from "../../reducers/gameReducer/gameReducer";

import CoworkersList from "../../components/CoworkersList/CoworkersList";

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
  const coworker = { imagePortraitUrl } as Coworker;

  return (
    <div>
      <CoworkersList coworkers={[coworker]} />
      <Radio.Group orientation="vertical" name="quiz" onChange={setAnswer}>
        {options.map((option) => (
          <Radio value={option} label={option} />
        ))}
      </Radio.Group>
    </div>
  );
};

export default PlayStage;
