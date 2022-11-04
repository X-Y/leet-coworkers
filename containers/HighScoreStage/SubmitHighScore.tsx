import { Button, Grid, Input, Stack, Title } from "@mantine/core";
import { useList, useListVals } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { Fragment } from "react";

import { getRealtimeDatabase } from "../../lib/firebase";

import TitleText from "../../components/TitleText/TitleText";
import { useState } from "react";
import {
  GameState,
  GameUndoAbleDispatch,
  Regions,
} from "../../reducers/gameReducer/gameReducer";
import { ST } from "next/dist/shared/lib/utils";

interface Props {
  gameDispatch: GameUndoAbleDispatch;
}

const SubmitHighScore: React.FC<Props> = ({ gameDispatch }) => {
  return (
    <Stack>
      <Title>Submit Your Score</Title>
      <Input></Input>
      <Button>Submit</Button>
    </Stack>
  );
};

export default SubmitHighScore;
