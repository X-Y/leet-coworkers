import { Box, Button, Container } from "@mantine/core";

import { GAME_ACTIONS } from "../../interfaces/Game";

import type {
  GameDispatch,
  GameState,
} from "../../reducers/gameReducer/gameReducer";

import CoworkersList from "../../components/CoworkersList/CoworkersList";
import BottomBar from "../../components/BottomBar/BottomBar";

interface MemoryStageProps {
  gameState: GameState;
  gameDispatch: GameDispatch;
}
const MemoryStage: React.FC<MemoryStageProps> = ({
  gameState,
  gameDispatch,
}) => {
  const onGameStartClick = () => {
    gameDispatch({ type: GAME_ACTIONS.START });
  };

  return (
    <>
      <Box sx={{ padding: "2rem", position: "relative" }}>
        <CoworkersList coworkers={gameState.entries} />
      </Box>

      <BottomBar>
        <Button sx={{ padding: "0 4rem" }} size="xl" onClick={onGameStartClick}>
          Start!
        </Button>
      </BottomBar>
    </>
  );
};

export default MemoryStage;
