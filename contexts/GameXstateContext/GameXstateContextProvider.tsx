import { ReactNode } from "react";
import { useInterpret } from "@xstate/react";
import { gameFlowMachine } from "../../gameState/gameFlow";

import GameXstateContext from "./GameXstateContext";

const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const gameService = useInterpret(gameFlowMachine);
  return (
    <GameXstateContext.Provider value={{ gameService }}>
      {children}
    </GameXstateContext.Provider>
  );
};

export default GameContextProvider;
