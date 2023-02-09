import { Stack, Checkbox, Box, CheckboxProps } from "@mantine/core";
import React, { useEffect, useReducer, useRef } from "react";

import { initGameDB } from "../../lib/gameDB";

import BottomBar from "../../components/BottomBar/BottomBar";
import TitleText from "../../components/TitleText/TitleText";
import BackButton from "../../components/BottomBar/BackButton";
import { SettingsID } from "./SettingsID";

const SettingCheckbox = (props: CheckboxProps) => {
  return (
    <Checkbox size="lg" styles={{ label: { color: "white" } }} {...props} />
  );
};

enum GAME_SETTINGS {
  DISABLE_OAUTH = "disableOAuth",
}

const initialSettings = {
  [GAME_SETTINGS.DISABLE_OAUTH]: false,
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

  const isDev =
    window?.location.origin !== process.env["NEXT_PUBLIC_PROD_HOSTS"];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Stack style={{ flexGrow: 1, marginLeft: "2rem" }}>
        <TitleText align={"left"}>Settings</TitleText>
        <Box>
          <SettingsID />
        </Box>
        <SettingCheckbox
          disabled={!isDev}
          checked={state[GAME_SETTINGS.DISABLE_OAUTH]}
          label={"Disable OAuth(Dev mode only)"}
          onChange={() => checkBoxChanged(GAME_SETTINGS.DISABLE_OAUTH)}
        />
      </Stack>
      <BottomBar>
        <BackButton />
      </BottomBar>
    </div>
  );
};

export default SettingsPage;
