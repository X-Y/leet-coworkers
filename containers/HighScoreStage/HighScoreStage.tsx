import {
  GameState,
  GameDispatch,
} from "../../reducers/gameReducer/gameReducer";
import { GameOverlayDispatch } from "../../reducers/gameReducer/gameOverlayReducer";

import SubmitHighScore from "./SubmitHighScore";
import DisplayHighScore from "./DisplayHighScore";

interface ResultStageProps {
  gameState: GameState;
  gameDispatch: GameDispatch;
  gameOverlayDispatch: GameOverlayDispatch;
}

const HighScoreStage: React.FC<ResultStageProps> = ({
  gameState,
  gameDispatch,
  gameOverlayDispatch,
}) => {
  const { newHighScore } = gameState;

  return newHighScore ? (
    <SubmitHighScore gameDispatch={gameDispatch} gameState={gameState} />
  ) : (
    <DisplayHighScore
      gameOverlayDispatch={gameOverlayDispatch}
      gameState={gameState}
    />
  );
};

export default HighScoreStage;
