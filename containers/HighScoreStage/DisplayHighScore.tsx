import { Button, Grid, Stack, Flex } from "@mantine/core";
import { useList, useListVals } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import React, { Fragment, useContext, useState } from "react";

import { GameStepProps } from "../../interfaces/GameStepProps";
import { GAME_OVERLAY_ACTIONS } from "../../interfaces/Game";

import { getRealtimeDatabase, getRegionString } from "../../lib/firebase";

import { Regions } from "../../reducers/gameReducer/gameReducer";

import TitleText from "../../components/TitleText/TitleText";
import BottomBar from "../../components/BottomBar/BottomBar";

import { KeyContext } from "./HighScoreStage";

const HighScoreFilters = ({
  current,
  onSelect,
}: {
  current: Regions;
  onSelect: (region: string) => void;
}) => {
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const text = (e.target as HTMLElement).textContent;
    text && onSelect(text);
  };
  return (
    <Flex onClick={onClick} gap={"sm"} wrap={"wrap"} justify={"center"}>
      {Object.values(Regions).map((one: string, idx) => {
        const variant = one === current ? "outline" : "subtle";
        return (
          <Button key={idx} variant={variant} color={"leetGreen.4"}>
            {one}
          </Button>
        );
      })}
    </Flex>
  );
};

const DisplayHighScore: React.FC<Omit<GameStepProps, "gameDispatch">> = ({
  gameOverlayDispatch,
}) => {
  const { key } = useContext(KeyContext);
  const [region, setRegion] = useState<Regions>(Regions.Everywhere);

  const database = getRealtimeDatabase();
  const [values, loading, error] = useList(
    ref(database, "highscore/" + getRegionString(region))
  );

  const onGameBackClick = () => {
    gameOverlayDispatch({ type: GAME_OVERLAY_ACTIONS.HIDE });
  };

  const list =
    values &&
    values
      .map((one) => {
        const values: {
          name: string;
          score: number;
        } = one.val();
        return {
          key: one.key,
          ...values,
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((one, idx) => ({
        ...one,
        no: idx,
      }))
      .filter(({ no, key: iKey }) => no < 10 || iKey === key);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Stack align={"center"} style={{ flexGrow: 1 }}>
        <>
          <TitleText>High Scores</TitleText>
          <HighScoreFilters
            current={region}
            onSelect={setRegion as (val: string) => void}
          />
          <Grid
            justify={"center"}
            sx={(theme) => ({
              width: "90vw",
              maxWidth: "60rem",
              color: "white",
              fontSize: theme.fontSizes.xl,
              fontWeight: 600,
              overflow: "hidden",
              marginBottom: "4rem",
            })}
          >
            <Grid.Col span={1}>#</Grid.Col>
            <Grid.Col sm={7} span={5}>
              Name
            </Grid.Col>
            <Grid.Col sm={2} span={3}>
              Score
            </Grid.Col>
            <Grid.Col sm={2} span={3}>
              Region
            </Grid.Col>

            {(error || loading) && (
              <Grid.Col span={12} style={{ textAlign: "center" }}>
                {error && "Error!"}
                {loading && "Loading..."}
              </Grid.Col>
            )}

            {!loading &&
              list &&
              list.map((v, id) => {
                const outOfList = v.key === key && v.no > 10;
                const isCurrent = v.key === key;
                return (
                  <Fragment key={id}>
                    {outOfList && <Grid.Col span={12}>...</Grid.Col>}

                    <Grid.Col span={1}>{v.no + 1}</Grid.Col>
                    <Grid.Col sm={7} span={5}>
                      {v.name} {isCurrent && "👈"}
                    </Grid.Col>
                    <Grid.Col sm={2} span={3}>
                      {v.score}
                    </Grid.Col>
                    <Grid.Col sm={2} span={3}>
                      {region}
                    </Grid.Col>

                    {outOfList && <Grid.Col span={12}>...</Grid.Col>}
                  </Fragment>
                );
              })}
          </Grid>
        </>
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
    </div>
  );
};

export default DisplayHighScore;
