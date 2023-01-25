import { Entry, Answer } from "../interfaces/Game";

import { initGameDB } from "../lib/gameDB";

export const calculateScore = (answersOrig: string[], entries: Entry[]) => {
  let score = 0;
  const result = entries.reduce((prev, curr, idx) => {
    const currentAnswer = answersOrig[idx];
    let isCorrect = false;
    if (curr.name.toLowerCase() === currentAnswer.toLowerCase()) {
      score += 1;
      isCorrect = true;
    }

    return [...prev, [currentAnswer, isCorrect] as Answer];
  }, [] as Answer[]);
  return [score, result] as [number, Answer[]];
};

export const saveStats = async (entries: Entry[], answers: Answer[]) => {
  const db = await initGameDB();

  await db.saveResults(entries, answers);

  console.log("stat saved");
};
