import {
  Entry,
  Answer,
  GAME_ACTIONS,
  GAME_STATES,
} from "../../interfaces/Game";
import { Coworker } from "../../interfaces/CoworkerModel";
import { Dispatch } from "react";

export type regionType = string | [string, string];
export const regionEveryWhere: regionType = ["Everywhere", ""];

export const iniGameState = {
  step: GAME_STATES.MENU,
  score: 0,
  amount: 10,
  confusions: 2,
  region: regionEveryWhere as regionType,
  entries: [] as Entry[],
  answers: [] as Answer[],
};

export type GameAction =
  | {
      type: GAME_ACTIONS.CONFIGS_DONE;
      payload?: { amount: number; confusions: number; region: regionType };
    }
  | { type: GAME_ACTIONS.START; payload: { entries: Entry[] } }
  | { type: GAME_ACTIONS.END; payload: { answers: Answer[]; score: number } }
  | { type: GAME_ACTIONS.RESTART };

export const gameStateReducer = (
  state: typeof iniGameState,
  action: GameAction
) => {
  switch (action.type) {
    case GAME_ACTIONS.CONFIGS_DONE:
      return {
        ...state,
        step: GAME_STATES.MEMORY,
        ...action.payload,
      };
    case GAME_ACTIONS.START:
      return {
        ...state,
        score: 0,
        step: GAME_STATES.PLAY,
        entries: action.payload.entries,
      };
    case GAME_ACTIONS.END:
      return {
        ...state,
        step: GAME_STATES.RESULT,
        score: action.payload.score,
        answers: action.payload.answers,
      };
    case GAME_ACTIONS.RESTART:
      return iniGameState;
  }
};

export type GameState = typeof iniGameState;
export type GameDispatch = Dispatch<GameAction>;
