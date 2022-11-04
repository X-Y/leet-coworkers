import { Grid, Stack } from "@mantine/core";
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

interface ResultStageProps {
  gameState: GameState;
  gameDispatch: GameUndoAbleDispatch;
}

const HighScoreStage: React.FC<ResultStageProps> = ({
  gameState,
  gameDispatch,
}) => {
  const [region, setRegion] = useState<Regions>(Regions.Stockholm);

  const database = getRealtimeDatabase();
  const [values, loading, error] = useListVals<{
    name: string;
    score: number;
  }>(ref(database, "highscore/" + region.toLowerCase()));

  return (
    <Stack align={"center"}>
      {error && "Error!"}
      {loading && "Loading..."}
      {!loading && values && (
        <>
          <TitleText>HighScores</TitleText>
          <Grid
            sx={(theme) => ({
              width: "90vw",
              maxWidth: "60rem",
              color: "white",
              fontSize: theme.fontSizes.xl,
              fontWeight: 600,
            })}
          >
            <Grid.Col span={8}>Name</Grid.Col>
            <Grid.Col span={2}>Score</Grid.Col>
            <Grid.Col span={2}>Region</Grid.Col>

            {values.map((v, id) => (
              <Fragment key={id}>
                <Grid.Col span={8}>{v.name}</Grid.Col>
                <Grid.Col span={2}>{v.score}</Grid.Col>
                <Grid.Col span={2}>Stockholm</Grid.Col>
              </Fragment>
            ))}
          </Grid>
        </>
      )}
    </Stack>
  );
};

export default HighScoreStage;
