import { Stack, Checkbox, CheckboxProps } from "@mantine/core";

import BottomBar from "../../components/BottomBar/BottomBar";
import TitleText from "../../components/TitleText/TitleText";
import { useEffect, useReducer, useRef, useState } from "react";
import { initGameDB } from "../../lib/gameDB";

const SettingCheckbox = (props: CheckboxProps) => {
  return (
    <Checkbox size="lg" styles={{ label: { color: "white" } }} {...props} />
  );
};

enum GAME_SETTINGS {
  TYPE_NAMES = "typeNames",
  REVEAL_OPTIONS = "revealOptions",
}

const initialSettings = {
  [GAME_SETTINGS.TYPE_NAMES]: false,
  [GAME_SETTINGS.REVEAL_OPTIONS]: false,
};

interface SettingsReducerAction {
  type: GAME_SETTINGS;
  value: boolean;
}

const reducer = (
  state: typeof initialSettings,
  action: SettingsReducerAction
) => {
  return {
    ...state,
    [action.type]: action.value,
  };
};

export const SettingsPage = () => {
  const dbRef = useRef<Awaited<ReturnType<typeof initGameDB>>>();

  const [state, dispatch] = useReducer(reducer, initialSettings);

  useEffect(() => {
    (async () => {
      const db = await initGameDB();
      dbRef.current = db;
      for (let stateKey in state) {
        const dbValue = (await db.getSetting(stateKey)) === "true";
        dispatch({ type: stateKey as GAME_SETTINGS, value: dbValue });
      }
    })();
  }, []);

  const checkBoxChanged = (key: GAME_SETTINGS) => {
    const newVal = !state[key];
    dispatch({ type: key, value: newVal });
    if (!dbRef.current) throw "dbRef is not set yet";
    dbRef.current.saveSetting(key, "" + newVal);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Stack style={{ flexGrow: 1, marginLeft: "2rem" }}>
        <TitleText align={"left"}>Settings</TitleText>
        <SettingCheckbox
          checked={state[GAME_SETTINGS.TYPE_NAMES]}
          label={"During play, names must be typed out"}
          onChange={() => checkBoxChanged(GAME_SETTINGS.TYPE_NAMES)}
        />
        <SettingCheckbox
          disabled={true}
          checked={state[GAME_SETTINGS.REVEAL_OPTIONS]}
          label={"During play, options will be revealed after a click"}
          onChange={() => checkBoxChanged(GAME_SETTINGS.REVEAL_OPTIONS)}
        />
      </Stack>
      <BottomBar hasBack />
    </div>
  );
};

export default SettingsPage;
