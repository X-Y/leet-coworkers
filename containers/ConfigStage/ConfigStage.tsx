import { Dispatch, useContext, useRef, useState } from "react";
import {
  Button,
  Select,
  Title,
  Stack,
  Center,
  MediaQuery,
} from "@mantine/core";
import { motion, Variants } from "framer-motion";

import { Entry, GAME_ACTIONS } from "../../interfaces/Game";
import { Coworker } from "../../interfaces/CoworkerModel";

import type {
  GameDispatch,
  GameState,
  regionType,
} from "../../reducers/gameReducer/gameReducer";
import { regionEveryWhere } from "../../reducers/gameReducer/gameReducer";
import { FilterContext } from "../../contexts/FilterContext/FilterContext";

import FlagText from "../../components/FlagText/FlagText";

const variantsTitle: Variants = {
  enter: {
    y: -200,
    opacity: 0,
  },
  ready: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -200,
    opacity: 0,
  },
};

const variantsMenu: Variants = {
  enter: {
    x: 200,
    opacity: 0,
  },
  ready: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -200,
    opacity: 0,
  },
};

const gameCities: regionType[] = [
  "Borlänge",
  "Helsingborg",
  "Ljubljana",
  "Lund",
  "Stockholm",
  ["Northen Sweden", "(Borlänge|Stockholm)"],
  ["Southen Sweden", "(Helsingborg|Lund)"],
  ["Sweden", "(Borlänge|Stockholm|Helsingborg|Lund)"],
  regionEveryWhere,
];

const numberQuizes = [10, 20, 40, 60];

const numberOptions = [2, 3, 4];

interface ConfigStageProps {
  gameState: GameState;
  gameDispatch: GameDispatch;
}
const ConfigStage: React.FC<ConfigStageProps> = ({
  gameState,
  gameDispatch,
}) => {
  const [gameRegion, setGameRegion] = useState<regionType>(regionEveryWhere);
  const numQuizRef = useRef<HTMLInputElement>(null);
  const numOptionsRef = useRef<HTMLInputElement>(null);

  const { setFilterValue } = useContext(FilterContext);

  const onConfigsDoneClick = () => {
    const numQuiz = +(numQuizRef.current?.value || "0");
    const numOptions = +(numOptionsRef.current?.value || "0");

    gameDispatch({
      type: GAME_ACTIONS.CONFIGS_DONE,
      payload: { amount: numQuiz, confusions: numOptions, region: gameRegion },
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
      <motion.div
        initial="enter"
        animate="ready"
        exit="exit"
        variants={{
          exit: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
        transition={{
          staggerChildren: 0.2,
        }}
      >
        <MediaQuery largerThan={"sm"} styles={{ marginTop: "8rem" }}>
          <Stack sx={{ padding: "0 0.5rem" }}>
            <motion.div variants={variantsTitle}>
              <FlagText size={60} weight={900}>
                THE GUESSING GAME
              </FlagText>
            </motion.div>

            <motion.div variants={variantsMenu}>
              <MediaQuery largerThan={"sm"} styles={{ maxWidth: "20rem" }}>
                <Stack sx={{ width: "100%", margin: "2rem auto" }}>
                  <Select
                    label="Pick a location:"
                    data={data}
                    defaultValue=""
                    onChange={(value) =>
                      setGameRegion(value || regionEveryWhere)
                    }
                    styles={(theme) => ({
                      label: {
                        color: theme.colors.leetPurple[0],
                      },
                    })}
                  />
                  <Select
                    label="Length of the quiz:"
                    ref={numQuizRef}
                    data={numberQuizes.map((one) => ({
                      value: "" + one,
                      label: "" + one,
                    }))}
                    defaultValue="10"
                    styles={(theme) => ({
                      label: {
                        color: theme.colors.leetPurple[0],
                      },
                    })}
                  />
                  <Select
                    label="How many choices:"
                    ref={numOptionsRef}
                    data={numberOptions.map((one) => ({
                      value: "" + one,
                      label: "" + one,
                    }))}
                    defaultValue="4"
                    styles={(theme) => ({
                      label: {
                        color: theme.colors.leetPurple[0],
                      },
                    })}
                  />
                </Stack>
              </MediaQuery>
            </motion.div>

            <motion.div variants={variantsMenu} style={{ textAlign: "center" }}>
              <MediaQuery largerThan={"xs"} styles={{ maxWidth: "15rem" }}>
                <Button
                  color="leetGreen"
                  sx={{ width: "100%", margin: " auto" }}
                  size="xl"
                  onClick={onConfigsDoneClick}
                >
                  Start
                </Button>
              </MediaQuery>
            </motion.div>
          </Stack>
        </MediaQuery>
      </motion.div>
    </Center>
  );
};

export default ConfigStage;
