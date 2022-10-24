import type { Dispatch } from "react";
import { Button } from "@mantine/core";

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
  const onGameStartClick = () => {
    gameDispatch({ type: GAME_ACTIONS.START });
  };

  return (
    <div>
      <CoworkersList coworkers={gameState.entries} />
      <Button onClick={onGameStartClick}>Next</Button>
    </div>
  );
};

export default MemoryStage;
