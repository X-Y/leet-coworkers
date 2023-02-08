import { Box, Button, Flex, Grid, Stack, Switch } from "@mantine/core";
import { useList } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import React, { Fragment, useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { getRealtimeDatabase, getRegionString } from "../../lib/firebase";

import { Regions } from "../../reducers/gameReducer/gameReducer";

import GameXstateContext from "../../contexts/GameXstateContext/GameXstateContext";

import TitleText from "../../components/TitleText/TitleText";
import BottomBar from "../../components/BottomBar/BottomBar";
import BackButton from "../../components/BottomBar/BackButton";

import { KeyContext } from "./HighScoreStage";
import { GAME_MODE } from "../../interfaces/Game";

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

const GameModeSwitch = ({
  mode,
  setMode,
}: {
  mode: GAME_MODE;
  setMode: (val: GAME_MODE) => void;
}) => {
  return (
    <Switch
      color={"leetPurple.3"}
      size={"lg"}
      checked={mode === GAME_MODE.TYPE}
      label={"Game Mode"}
      onLabel={"type"}
      offLabel={"opts"}
      onChange={(e) => {
        setMode(e.currentTarget.checked ? GAME_MODE.TYPE : GAME_MODE.OPTIONS);
      }}
      styles={(theme) => ({
        root: {
          display: "flex",
          alignItems: "center",
        },
        label: {
          color: theme.colors.leetPurple[6],
          fontSize: "0.8rem",
        },
      })}
    />
  );
};

const DisplayHighScore = () => {
  const gameService = useContext(GameXstateContext);
  const [current, send] = useActor(gameService.gameService);

  const { region: gameRegion = Regions.Everywhere } = current.context;

  const { key } = useContext(KeyContext);
  const [region, setRegion] = useState<Regions>(gameRegion);

  const [mode, setMode] = useState(GAME_MODE.TYPE);

  const database = getRealtimeDatabase();
  const [values, loading, error] = useList(
    ref(database, "highscore/" + getRegionString(region))
  );

  const list =
    values &&
    values
      .map((one) => {
        const values: {
          name: string;
          score: number;
          gameMode: GAME_MODE;
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
      .filter(({ gameMode }) => (gameMode || GAME_MODE.OPTIONS) === mode)
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
              color: mode === GAME_MODE.TYPE ? "gold" : "white",
              fontSize: theme.fontSizes.xl,
              fontWeight: 600,
              overflow: "hidden",
              marginBottom: "4rem",
            })}
          >
            <Grid.Col span={1}>#</Grid.Col>
            <Grid.Col sm={5} span={4}>
              Name
            </Grid.Col>
            <Grid.Col sm={2} span={2}>
              Score
            </Grid.Col>
            <Grid.Col sm={2} span={2}>
              Mode
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

                    <Box
                      sx={(theme) => ({
                        display: "contents",
                        color: isCurrent
                          ? theme.colors.leetGreen[6]
                          : undefined,
                      })}
                    >
                      <Grid.Col span={1}>{v.no + 1}</Grid.Col>
                      <Grid.Col sm={5} span={4}>
                        {v.name}
                      </Grid.Col>
                      <Grid.Col sm={2} span={2}>
                        {v.score}
                      </Grid.Col>
                      <Grid.Col sm={2} span={2}>
                        {v.gameMode}
                      </Grid.Col>
                      <Grid.Col sm={2} span={3}>
                        {region}
                      </Grid.Col>
                    </Box>

                    {outOfList && <Grid.Col span={12}>...</Grid.Col>}
                  </Fragment>
                );
              })}
          </Grid>
        </>
      </Stack>
      <BottomBar>
        <GameModeSwitch mode={mode} setMode={setMode} />
        <BackButton />
      </BottomBar>
    </div>
  );
};

export default DisplayHighScore;
