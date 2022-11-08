import { Button, Grid, Input, Stack, Title } from "@mantine/core";
import { useList, useListVals } from "react-firebase-hooks/database";
import { ref, push, child } from "firebase/database";
import { ChangeEvent, ChangeEventHandler, Fragment, useState } from "react";

import { GAME_ACTIONS } from "../../interfaces/Game";
import { GameStepProps } from "../../interfaces/GameStepProps";

import { getRealtimeDatabase } from "../../lib/firebase";

const SubmitHighScore: React.FC<Omit<GameStepProps, "gameOverlayDispatch">> = ({
  gameDispatch,
  gameState,
}) => {
  const [name, setName] = useState("");
  const { region, score } = gameState;

  const submitHighScore = () => {
    const highScoreValue = {
      name,
      score,
    };

    const database = getRealtimeDatabase();

    const regionString = (typeof region === "string" ? region : region[0])
      .toLowerCase()
      .replaceAll(" ", "");

    const newKey = push(
      ref(database, "highscore/" + regionString),
      highScoreValue
    ).key;

    gameDispatch({ type: GAME_ACTIONS.SUBMIT_HIGHSCORE });
  };

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.toUpperCase());
  };

  return (
    <Stack>
      <Title>Submit Your Score</Title>
      <Input type="text" onChange={onChangeName}></Input>
      <Button onClick={submitHighScore}>Submit</Button>
    </Stack>
  );
};

export default SubmitHighScore;
