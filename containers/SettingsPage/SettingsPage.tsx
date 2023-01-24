import { Stack, Checkbox, CheckboxProps } from "@mantine/core";

import BottomBar from "../../components/BottomBar/BottomBar";
import TitleText from "../../components/TitleText/TitleText";
import { useEffect, useRef, useState } from "react";
import { initGameDB } from "../../lib/gameDB";

const SettingCheckbox = (props: CheckboxProps) => {
  return (
    <Checkbox size="lg" styles={{ label: { color: "white" } }} {...props} />
  );
};
export const SettingsPage = () => {
  const dbRef = useRef<Awaited<ReturnType<typeof initGameDB>>>();
  const [typeNames, setTypeNames] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const db = await initGameDB();
      dbRef.current = db;
      const dbTypeName = (await db.getSetting("typeNames")) === "true";
      setTypeNames(dbTypeName);
    })();
  }, []);

  const typeNamesChanged = () => {
    const newVal = !typeNames;
    setTypeNames(newVal);
    if (!dbRef.current) throw "dbRef is not set yet";
    dbRef.current.saveSetting("typeNames", "" + newVal);
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Stack style={{ flexGrow: 1, marginLeft: "2rem" }}>
        <TitleText align={"left"}>Settings</TitleText>
        <SettingCheckbox
          checked={typeNames}
          name={"typeNames"}
          label={"Type out the names"}
          onChange={typeNamesChanged}
        />
      </Stack>
      <BottomBar hasBack />
    </div>
  );
};

export default SettingsPage;
