import { Box, Grid, Text, Center, Stack } from "@mantine/core";

import { Coworker as CoworkerModel } from "../../interfaces/CoworkerModel";

import Coworker from "../Coworker/Coworker";

interface Props {
  coworker: CoworkerModel;
  answer: string;
  isCorrect: boolean;
}
const GameResultTile: React.FC<Props> = ({ coworker, answer, isCorrect }) => {
  return (
    <Stack>
      <Box>
        <Coworker {...coworker} />
      </Box>
      <Box>
        <Center sx={{ height: "100%" }}>
          {isCorrect ? (
            <Text color={"green"}>Correct ✅</Text>
          ) : (
            <Text color={"red"}>You answered: {answer} 🙁</Text>
          )}
        </Center>
      </Box>
    </Stack>
  );
};

export default GameResultTile;
