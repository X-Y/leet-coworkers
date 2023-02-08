import { Dispatch } from "react";

import {
  Entry,
  Answer,
  GAME_ACTIONS,
  GAME_STATES,
} from "../../interfaces/Game";

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

export const iniGameState = {
  step: GAME_STATES.MENU,
  score: 0,
  amount: 10,
  confusions: 2,
  newHighScore: false,
  region: Regions.Everywhere,
  entries: [] as Entry[],
  answers: [] as Answer[],
};

export type GameAction =
  | {
      type: GAME_ACTIONS.CONFIGS_DONE;
      payload?: { amount: number; confusions: number; region: Regions };
    }
  | { type: GAME_ACTIONS.START; payload: { entries: Entry[] } }
  | { type: GAME_ACTIONS.END; payload: { answers: Answer[]; score: number } }
  | { type: GAME_ACTIONS.RESTART }
  | { type: GAME_ACTIONS.SUBMIT_HIGHSCORE };

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
    case GAME_ACTIONS.SUBMIT_HIGHSCORE:
      return {
        ...state,
        newHighScore: false,
      };
  }
};

//[label, search_string, is_region]
export const gameCities: [Regions, string, boolean][] = [
  [Regions.Borlänge, "Borlänge", false],
  [Regions.Helsingborg, "Helsingborg", false],
  [Regions.Ljubljana, "Ljubljana", false],
  [Regions.Lund, "Lund", false],
  [Regions.Stockholm, "Stockholm", false],
  [Regions.NorthenSweden, "(Borlänge|Stockholm)", true],
  [Regions.SouthenSweden, "(Helsingborg|Lund)", true],
  [Regions.Sweden, "(Borlänge|Stockholm|Helsingborg|Lund)", true],
  [Regions.Everywhere, "", true],
];

export type GameState = typeof iniGameState;
export type GameDispatch = Dispatch<GameAction>;
