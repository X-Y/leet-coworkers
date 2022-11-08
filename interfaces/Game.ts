import { Coworker } from "./CoworkerModel";

export enum GAME_STATES {
  MENU = "MENU",
  MEMORY = "MEMORY",
  PLAY = "PLAY",
  RESULT = "RESULT",
}

export enum GAME_ACTIONS {
  CONFIGS_DONE,
  START,
  END,
  RESTART,

  SUBMIT_HIGHSCORE,
}

export type Entry = Coworker & {
  options: string[];
};
export type Answer = [string, boolean];

export enum GAME_OVERLAY_STATES {
  NONE = "NONE",
  STATS = "STATS",
  HIGHSCORE = "HIGHSCORE",
}

export enum GAME_OVERLAY_ACTIONS {
  SHOW_STATS,
  SHOW_HIGHSCORE,
  HIDE,
}
