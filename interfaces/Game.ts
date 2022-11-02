import { Coworker } from "./CoworkerModel";

export enum GAME_STATES {
  MENU,
  MEMORY,
  PLAY,
  RESULT,

  STATS,
}

export enum GAME_ACTIONS {
  CONFIGS_DONE,
  START,
  END,
  RESTART,
  SHOW_STATS,
}

export type Entry = Coworker & {
  options: string[];
};
export type Answer = [string, boolean];
