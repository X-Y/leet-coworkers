import type {
  GameDispatch,
  GameState,
} from "../reducers/gameReducer/gameReducer";
import { GameOverlayDispatch } from "../reducers/gameReducer/gameOverlayReducer";

export interface GameStepProps {
  gameState: GameState;
  gameDispatch: GameDispatch;
  gameOverlayDispatch: GameOverlayDispatch;
}
