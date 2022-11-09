import { createContext, useState } from "react";
import {
  GameState,
  GameDispatch,
} from "../../reducers/gameReducer/gameReducer";
import { GameOverlayDispatch } from "../../reducers/gameReducer/gameOverlayReducer";

import SubmitHighScore from "./SubmitHighScore";
import DisplayHighScore from "./DisplayHighScore";

export const KeyContext = createContext<{
  key: string;
  setKey: (val: string) => void;
}>({
  key: "",
  setKey: () => {},
});

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
  const [key, setKey] = useState("");

  return (
    <KeyContext.Provider value={{ key, setKey }}>
      {newHighScore ? (
        <SubmitHighScore gameDispatch={gameDispatch} gameState={gameState} />
      ) : (
        <DisplayHighScore
          gameOverlayDispatch={gameOverlayDispatch}
          gameState={gameState}
        />
      )}
    </KeyContext.Provider>
  );
};

export default HighScoreStage;
