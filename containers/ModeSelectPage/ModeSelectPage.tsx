import {
  Button,
  Checkbox,
  Flex,
  Radio,
  RadioProps,
  Select,
  Space,
  Stack,
} from "@mantine/core";
import React, { Dispatch, useContext, useReducer } from "react";
import { useActor } from "@xstate/react";

import { GAME_ACTIONS, GAME_MODE } from "../../interfaces/Game";

import GameXstateContext from "../../contexts/GameXstateContext/GameXstateContext";

import BottomBar from "../../components/BottomBar/BottomBar";
import BackButton from "../../components/BottomBar/BackButton";
import TitleText from "../../components/TitleText/TitleText";

const initialState = {
  mode: "options" as GAME_MODE,
  confusions: 4,
  revealByClick: false,
};

interface ModeRadioProps extends RadioProps {
  currentMode: GAME_MODE;
  dispatch: Dispatch<{ mode: GAME_MODE }>;
  mode: GAME_MODE;
}
const ModeRadio = ({
  currentMode,
  dispatch,
  mode,
  ...otherProps
}: ModeRadioProps) => {
  return (
    <Radio
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
  const [_, send] = useActor(gameService.gameService);

  const { mode, confusions, revealByClick } = state;

  const onNextClick = () => {
    if (mode === GAME_MODE.OPTIONS) {
      send({
        type: GAME_ACTIONS.MODE_SELECTED,
        payload: { gameMode: GAME_MODE.OPTIONS, confusions, revealByClick },
      });
    } else if (mode === GAME_MODE.TYPE) {
      send({
        type: GAME_ACTIONS.MODE_SELECTED,
        payload: { gameMode: GAME_MODE.TYPE },
      });
    } else {
      throw `game mode ${mode} does not exist`;
    }
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Stack style={{ flexGrow: 1, margin: "2rem" }}>
        <TitleText order={2} size={40} align={"left"}>
          Game Mode
        </TitleText>
        <Flex gap={"lg"}>
          <ModeRadio
            currentMode={mode}
            mode={GAME_MODE.OPTIONS}
            value={"options"}
            dispatch={dispatch}
            label={"Options Mode"}
          />
          <ModeRadio
            currentMode={mode}
            mode={GAME_MODE.TYPE}
            value={"type"}
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
          Done
        </Button>
      </BottomBar>
    </div>
  );
};

export default ModeSelectPage;
