import { Dispatch } from "react";

import {
  Entry,
  Answer,
  GAME_ACTIONS,
  GAME_STATES,
} from "../../interfaces/Game";
import { Coworker } from "../../interfaces/CoworkerModel";

import {
  UndoRedoAction,
  HistoryType as GenericHistoryType,
} from "../../lib/useUndoReducer";

export enum Regions {
  Borlänge = "Borlänge",
  Helsingborg = "Helsingborg",
  Ljubljana = "Ljubljana",
  Lund = "Lund",
  Stockholm = "Stockholm",
  NorthenSweden = "Northen Sweden",
  SouthenSweden = "Southen Sweden",
  Sweden = "Sweden",
  Everywhere = "Everywhere",
}
export type regionType = Regions | [Regions, string];
export const regionEveryWhere: regionType = [Regions.Everywhere, ""];

export const iniGameState = {
  step: GAME_STATES.MENU,
  score: 0,
  amount: 10,
  confusions: 2,
  newHighScore: false,
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
  | { type: GAME_ACTIONS.RESTART }
  | { type: GAME_ACTIONS.SHOW_STATS }
  | { type: GAME_ACTIONS.SHOW_HIGHSCORE };

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
        newHighScore: false,
        step: GAME_STATES.PLAY,
        entries: action.payload.entries,
      };
    case GAME_ACTIONS.END:
      return {
        ...state,
        step: GAME_STATES.RESULT,
        score: action.payload.score,
        answers: action.payload.answers,
        newHighScore: true,
      };
    case GAME_ACTIONS.RESTART:
      return iniGameState;
    case GAME_ACTIONS.SHOW_STATS:
      return {
        ...state,
        step: GAME_STATES.STATS,
      };
    case GAME_ACTIONS.SHOW_HIGHSCORE:
      return {
        ...state,
        step: GAME_STATES.HIGHSCORE,
      };
  }
};

export const gameCities: regionType[] = [
  Regions.Borlänge,
  Regions.Helsingborg,
  Regions.Ljubljana,
  Regions.Lund,
  Regions.Stockholm,
  [Regions.NorthenSweden, "(Borlänge|Stockholm)"],
  [Regions.SouthenSweden, "(Helsingborg|Lund)"],
  [Regions.Sweden, "(Borlänge|Stockholm|Helsingborg|Lund)"],
  regionEveryWhere,
];

export type GameState = typeof iniGameState;
export type GameDispatch = Dispatch<GameAction>;
export type GameUndoAbleDispatch = Dispatch<GameAction | UndoRedoAction>;
export type HistoryType = GenericHistoryType<GameState>;
