import { Dispatch, useContext } from "react";
import { Button, Select } from "@mantine/core";

import { Entry, GAME_ACTIONS } from "../../interfaces/Game";
import { Coworker } from "../../interfaces/CoworkerModel";

import { GameAction } from "../../reducers/gameReducer/gameReducer";
import type {
  GameDispatch,
  GameState,
} from "../../reducers/gameReducer/gameReducer";

import CoworkersList from "../../components/CoworkersList/CoworkersList";
import Filter from "../Filter/Filter";
import { FilterContext } from "../../contexts/FilterContext/FilterContext";

const gameCities: (string | [string, string])[] = [
  "Borlänge",
  "Helsingborg",
  "Ljubljana",
  "Lund",
  "Stockholm",
  ["Northen Sweden", "(Borlänge|Stockholm)"],
  ["Southen Sweden", "(Helsingborg|Lund)"],
  ["Whole Sweden", "(Borlänge|Stockholm|Helsingborg|Lund)"],
];

interface ConfigStageProps {
  resData?: Coworker[];
  gameState: GameState;
  gameDispatch: GameDispatch;
}
const ConfigStage: React.FC<ConfigStageProps> = ({
  resData,
  gameState,
  gameDispatch,
}) => {
  const { setFilterValue } = useContext(FilterContext);

  const onConfigsDoneClick = () => {
    const resDataConst = resData;
    if (!resDataConst) return;

    const entries: Entry[] = resDataConst
      .filter((one) => !!one.imagePortraitUrl)
      .sort(() => 0.5 - Math.random())
      .slice(0, gameState.amount)
      .map((one) => {
        let confuses: string[] = [];
        while (confuses.length < gameState.confusions) {
          const confuse =
            resDataConst[Math.round(Math.random() * (resDataConst.length - 1))];
          if (confuses.findIndex((name) => name === confuse.name) === -1) {
            confuses.push(confuse.name);
          }
        }

        const options = [one.name, ...confuses].sort(() => 0.5 - Math.random());

        return {
          ...one,
          options,
        };
      });

    gameDispatch({ type: GAME_ACTIONS.CONFIGS_DONE, payload: { entries } });
  };

  const data = gameCities.map((one) => {
    if (typeof one === "string") {
      return { value: one, label: one, group: "Cities" };
    } else {
      const [label, value] = one;
      return { value, label, group: "Regions" };
    }
  });
  return (
    <div>
      <Select
        label="Please pick a location:"
        data={data}
        onChange={setFilterValue}
      />
      <Button onClick={onConfigsDoneClick}>Start</Button>
    </div>
  );
};

export default ConfigStage;
