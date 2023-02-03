import { motion, Variants } from "framer-motion";
import { Center, MediaQuery, Select, Stack } from "@mantine/core";
import FlagText from "../../components/FlagText/FlagText";
import {
  regionEveryWhere,
  Regions,
} from "../../reducers/gameReducer/gameReducer";
import {
  ConfigStageMainButton,
  ConfigStageSubButton,
} from "./ConfigStageButton";
import { GoogleIdentity } from "../../components/GoogleIdentity/GoogleIdentity";

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

export const ConfigStageLogin = () => {
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
              <Center>
                <GoogleIdentity />
              </Center>
            </motion.div>
          </Stack>
        </MediaQuery>
      </motion.div>
    </Center>
  );
};

export default ConfigStageLogin;
