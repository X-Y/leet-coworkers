import { Button, Grid, Stack } from "@mantine/core";
import { useList, useListVals } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { Fragment, useState } from "react";

import { GameStepProps } from "../../interfaces/GameStepProps";
import { GAME_OVERLAY_ACTIONS } from "../../interfaces/Game";

import { getRealtimeDatabase } from "../../lib/firebase";

import { Regions } from "../../reducers/gameReducer/gameReducer";

import TitleText from "../../components/TitleText/TitleText";

import BottomBar from "../../components/BottomBar/BottomBar";

const DisplayHighScore: React.FC<Omit<GameStepProps, "gameDispatch">> = ({
  gameOverlayDispatch,
}) => {
  const [region, setRegion] = useState<Regions>(Regions.Stockholm);

  const database = getRealtimeDatabase();
  const [values, loading, error] = useListVals<{
    name: string;
    score: number;
  }>(ref(database, "highscore/" + region.toLowerCase()));

  const onGameBackClick = () => {
    gameOverlayDispatch({ type: GAME_OVERLAY_ACTIONS.HIDE });
  };
  return (
    <>
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
      <BottomBar>
        <Button
          color="leetPurple"
          variant="light"
          size="lg"
          onClick={onGameBackClick}
        >
          Back
        </Button>
      </BottomBar>
    </>
  );
};

export default DisplayHighScore;
