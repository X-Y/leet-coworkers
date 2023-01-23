import { createContext, useContext, useState } from "react";
import {
  GameState,
  GameDispatch,
} from "../../reducers/gameReducer/gameReducer";
import { GameOverlayDispatch } from "../../reducers/gameReducer/gameOverlayReducer";

import SubmitHighScore from "./SubmitHighScore";
import DisplayHighScore from "./DisplayHighScore";
import GameXstateContext from "../../contexts/GameXstateContext/GameXstateContext";
import { useActor } from "@xstate/react";

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

const HighScoreStage = () => {
  const gameService = useContext(GameXstateContext);
  const [current] = useActor(gameService.gameService);

  const [key, setKey] = useState("");

  return (
    <KeyContext.Provider value={{ key, setKey }}>
      {current.matches("overlays.leaderBoardStage.submitPage") ? (
        <SubmitHighScore />
      ) : (
        <DisplayHighScore />
      )}
    </KeyContext.Provider>
  );
};

export default HighScoreStage;
