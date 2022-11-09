import { Dispatch } from "react";

import {
  GAME_OVERLAY_ACTIONS,
  GAME_OVERLAY_STATES,
} from "../../interfaces/Game";

export const iniGameOverlayState = {
  step: GAME_OVERLAY_STATES.NONE,
};

export type GameOverlayAction =
  | { type: GAME_OVERLAY_ACTIONS.SHOW_STATS }
  | { type: GAME_OVERLAY_ACTIONS.SHOW_HIGHSCORE }
  | { type: GAME_OVERLAY_ACTIONS.HIDE };

export const gameOverlayStateReducer = (
  state: typeof iniGameOverlayState,
  action: GameOverlayAction
) => {
  switch (action.type) {
    case GAME_OVERLAY_ACTIONS.SHOW_STATS:
      return {
        ...state,
        step: GAME_OVERLAY_STATES.STATS,
      };
    case GAME_OVERLAY_ACTIONS.SHOW_HIGHSCORE:
      return {
        ...state,
        step: GAME_OVERLAY_STATES.HIGHSCORE,
      };
    case GAME_OVERLAY_ACTIONS.HIDE:
      return {
        ...state,
        step: GAME_OVERLAY_STATES.NONE,
      };
  }
};

export type GameOverlayState = typeof iniGameOverlayState;
export type GameOverlayDispatch = Dispatch<GameOverlayAction>;
