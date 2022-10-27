import { Box, Button, Container } from "@mantine/core";
import { motion } from "framer-motion";

import { GAME_ACTIONS } from "../../interfaces/Game";

import type {
  GameDispatch,
  GameState,
} from "../../reducers/gameReducer/gameReducer";

import CoworkersList from "../../components/CoworkersList/CoworkersList";
import BottomBar from "../../components/BottomBar/BottomBar";
import { useEffect, useState } from "react";

interface MemoryStageProps {
  gameState: GameState;
  gameDispatch: GameDispatch;
}
const MemoryStage: React.FC<MemoryStageProps> = ({
  gameState,
  gameDispatch,
}) => {
  const [inStage, setInStage] = useState(false);

  const onGameStartClick = () => {
    setInStage(false);
    setTimeout(() => {
      gameDispatch({ type: GAME_ACTIONS.START });
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => {
      setInStage(true);
    }, 600);
    return () => {
      setInStage(false);
    };
  }, []);

  return (
    <motion.div animate={inStage ? "open" : "closed"} initial={false}>
      <Box sx={{ padding: "2rem", position: "relative", minHeight: "100vh" }}>
        <CoworkersList coworkers={gameState.entries} />
      </Box>

      <BottomBar>
        <Button
          color="leetPurple"
          sx={{ padding: "0 4rem" }}
          size="lg"
          onClick={onGameStartClick}
        >
          Start!
        </Button>
      </BottomBar>
    </motion.div>
  );
};

export default MemoryStage;
