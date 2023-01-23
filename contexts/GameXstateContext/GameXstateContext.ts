import { createContext } from "react";
import { InterpreterFrom } from "xstate";
import { gameFlowMachine } from "../../gameState/gameFlow";

const GameXstateContext = createContext({
  gameService: {} as InterpreterFrom<typeof gameFlowMachine>,
});

export default GameXstateContext;
