import {
  Stack,
  Checkbox,
  CheckboxProps,
  Select,
  Flex,
  Space,
  Button,
} from "@mantine/core";
import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  Dispatch,
} from "react";
import { useActor } from "@xstate/react";

import { initGameDB } from "../../lib/gameDB";

import GameXstateContext from "../../contexts/GameXstateContext/GameXstateContext";

import BottomBar from "../../components/BottomBar/BottomBar";
import BackButton from "../../components/BottomBar/BackButton";
import TitleText from "../../components/TitleText/TitleText";
import { GAME_ACTIONS, GameMode } from "../../interfaces/Game";

const initialState = {
  mode: "options" as GameMode,
  confusions: 4,
  revealByClick: false,
};

interface ModeCheckBoxProps extends CheckboxProps {
  currentMode: GameMode;
  dispatch: Dispatch<{ mode: GameMode }>;
  mode: GameMode;
}
const ModeCheckBox = ({
  currentMode,
  dispatch,
  mode,
  ...otherProps
}: ModeCheckBoxProps) => {
  return (
    <Checkbox
      size="lg"
      styles={{ label: { color: "white" } }}
      label={"Options Mode"}
      {...otherProps}
      onChange={() => dispatch({ mode })}
      checked={mode === currentMode}
    />
  );
};

const reducer = (
  prevState: typeof initialState,
  action: Partial<typeof initialState>
) => {
  return { ...prevState, ...action };
};

const numberOptions = [2, 3, 4];

export const ModeSelectPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const gameService = useContext(GameXstateContext);
  const [current, send] = useActor(gameService.gameService);

  const { mode, confusions, revealByClick } = state;

  const onNextClick = () => {
    if (mode === "options") {
      send([
        {
          type: GAME_ACTIONS.MODE_SELECTED,
          payload: { gameMode: "options", confusions, revealByClick },
        },
        { type: GAME_ACTIONS.CONFIGS_DONE },
      ]);
    } else if (mode === "type") {
      send([
        { type: GAME_ACTIONS.MODE_SELECTED, payload: { gameMode: "type" } },
        { type: GAME_ACTIONS.CONFIGS_DONE },
      ]);
    } else {
      throw `game mode ${mode} does not exist`;
    }
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Stack style={{ flexGrow: 1, marginLeft: "2rem" }}>
        <TitleText align={"left"}>Game Mode</TitleText>
        <Flex gap={"lg"}>
          <ModeCheckBox
            currentMode={mode}
            mode={"options"}
            dispatch={dispatch}
            label={"Options Mode"}
          />
          <ModeCheckBox
            currentMode={mode}
            mode={"type"}
            dispatch={dispatch}
            label={"Type out Mode"}
          />
        </Flex>

        <Space />

        {mode === "options" && (
          <Stack>
            <Select
              label="How many choices:"
              data={numberOptions.map((one) => ({
                value: "" + one,
                label: "" + one,
              }))}
              value={confusions + ""}
              size={"md"}
              styles={(theme) => ({
                wrapper: {
                  maxWidth: "20rem",
                },
                label: {
                  color: theme.colors.leetPurple[0],
                },
              })}
              onChange={(value) => dispatch({ confusions: +(value || "0") })}
            />
            <Checkbox
              size="md"
              styles={{ label: { color: "white" } }}
              label={"Reveal by Click"}
              checked={revealByClick}
              onChange={(e) => dispatch({ revealByClick: e.target.checked })}
            />
          </Stack>
        )}
      </Stack>
      <BottomBar>
        <BackButton />
        <Button color="leetPurple" size="lg" onClick={onNextClick}>
          Next
        </Button>
      </BottomBar>
    </div>
  );
};

export default ModeSelectPage;
