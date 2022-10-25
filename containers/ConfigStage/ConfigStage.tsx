import { Dispatch, useContext, useRef } from "react";
import {
  Button,
  Select,
  Title,
  Stack,
  Center,
  MediaQuery,
} from "@mantine/core";

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

const numberQuizes = [10, 20];

const numberOptions = [2, 3, 4];

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
  const numQuizRef = useRef<HTMLInputElement>(null);
  const numOptionsRef = useRef<HTMLInputElement>(null);

  const { setFilterValue } = useContext(FilterContext);

  const onConfigsDoneClick = () => {
    const resDataConst = resData;
    if (!resDataConst) return;

    const numQuiz = +(numQuizRef.current?.value || "0");
    const numOptions = +(numOptionsRef.current?.value || "0");

    console.log(numOptions, numQuiz);

    const entries: Entry[] = resDataConst
      .filter((one) => !!one.imagePortraitUrl)
      .sort(() => 0.5 - Math.random())
      .slice(0, numQuiz || gameState.amount)
      .map((one) => {
        let confuses: string[] = [one.name];
        while (confuses.length < (numOptions || gameState.confusions)) {
          const confuse =
            resDataConst[Math.round(Math.random() * (resDataConst.length - 1))];
          if (confuses.findIndex((name) => name === confuse.name) === -1) {
            confuses.push(confuse.name);
          }
        }

        const options = confuses.sort(() => 0.5 - Math.random());

        return {
          ...one,
          options,
        };
      });

    gameDispatch({
      type: GAME_ACTIONS.CONFIGS_DONE,
      payload: { entries, amount: numQuiz, confusions: numOptions },
    });
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
    <Center>
      <MediaQuery largerThan={"sm"} styles={{ marginTop: "8rem" }}>
        <Stack sx={{ padding: "0 0.5rem" }}>
          <Title
            size={70}
            weight={900}
            variant="gradient"
            gradient={{ from: "cyan", to: "yellow", deg: 15 }}
          >
            THE GUESSING GAME
          </Title>

          <MediaQuery largerThan={"sm"} styles={{ maxWidth: "20rem" }}>
            <Stack sx={{ width: "100%", margin: "2rem auto" }}>
              <Select
                label="Pick a location:"
                data={data}
                onChange={setFilterValue}
              />
              <Select
                label="How many quizes:"
                ref={numQuizRef}
                data={numberQuizes.map((one) => ({
                  value: "" + one,
                  label: "" + one,
                }))}
              />
              <Select
                label="How many options:"
                ref={numOptionsRef}
                data={numberOptions.map((one) => ({
                  value: "" + one,
                  label: "" + one,
                }))}
              />
            </Stack>
          </MediaQuery>
          <MediaQuery largerThan={"xs"} styles={{ maxWidth: "15rem" }}>
            <Button
              sx={{ width: "100%", margin: " auto" }}
              size="xl"
              onClick={onConfigsDoneClick}
            >
              Start
            </Button>
          </MediaQuery>
        </Stack>
      </MediaQuery>
    </Center>
  );
};

export default ConfigStage;
