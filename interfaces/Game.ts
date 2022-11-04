import { Coworker } from "./CoworkerModel";

export enum GAME_STATES {
  MENU,
  MEMORY,
  PLAY,
  RESULT,

  STATS,
  HIGHSCORE,
}

export enum GAME_ACTIONS {
  CONFIGS_DONE,
  START,
  END,
  RESTART,

  SHOW_STATS,
  SUBMIT_HIGHSCORE,
  SHOW_HIGHSCORE,
}

export type Entry = Coworker & {
  options: string[];
};
export type Answer = [string, boolean];
