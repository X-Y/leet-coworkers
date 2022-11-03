import { Box, Grid, Text, Center, Stack } from "@mantine/core";

import { Coworker as CoworkerModel } from "../../interfaces/CoworkerModel";

import Coworker from "../Coworker/Coworker";

interface Props {
  coworker: CoworkerModel;
  hits?: number;
  misses?: number;
}
const GameStatsTile: React.FC<Props> = ({ coworker, hits, misses }) => {
  return (
    <Stack>
      <Box>
        <Coworker {...coworker} />
      </Box>
      <Box>
        <Center sx={{ height: "100%" }}>
          {hits && <Text color={"green"}>Hits: {hits}</Text>}
          {misses && <Text color={"red"}>Misses: {misses}</Text>}
        </Center>
      </Box>
    </Stack>
  );
};

export default GameStatsTile;
