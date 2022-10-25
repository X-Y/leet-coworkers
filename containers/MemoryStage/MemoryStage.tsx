import type { Dispatch } from "react";
import { Box, Button, Container } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";

import { GAME_ACTIONS } from "../../interfaces/Game";

import { GameAction } from "../../reducers/gameReducer/gameReducer";
import type {
  GameDispatch,
  GameState,
} from "../../reducers/gameReducer/gameReducer";

import CoworkersList from "../../components/CoworkersList/CoworkersList";

interface MemoryStageProps {
  gameState: GameState;
  gameDispatch: GameDispatch;
}
const MemoryStage: React.FC<MemoryStageProps> = ({
  gameState,
  gameDispatch,
}) => {
  const { ref, entry } = useIntersection({
    threshold: 1,
  });

  console.log(entry);

  const onGameStartClick = () => {
    gameDispatch({ type: GAME_ACTIONS.START });
  };

  return (
    <>
      <Box sx={{ padding: "2rem", position: "relative" }}>
        <CoworkersList coworkers={gameState.entries} />
      </Box>

      <Box
        ref={ref}
        sx={{
          padding: "2rem 5rem",
          position: "sticky",
          bottom: "-1px",
          background: "white",
          width: "100%",
          textAlign: "right",
          boxShadow: entry?.isIntersecting ? "" : "0 0 1.5rem lightGrey",
        }}
      >
        <Button sx={{ padding: "0 4rem" }} size="xl" onClick={onGameStartClick}>
          Start!
        </Button>
      </Box>
    </>
  );
};

export default MemoryStage;
