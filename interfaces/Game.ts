import { Coworker } from "./CoworkerModel";

export enum GAME_STATES {
  MENU = "MENU",
  MEMORY = "MEMORY",
  PLAY = "PLAY",
  RESULT = "RESULT",
}

export enum GAME_ACTIONS {
  CONFIGS_DONE = "CONFIGS_DONE",
  START = "START",
  END = "END",
  RESTART = "RESTART",
  BACK_TO_MENU = "BACK_TO_MENU",

  GENERATE = "GENERATE",
  RESULT_DISPLAYED = "RESULT_DISPLAYED",

  GO_TO_LEADER_BOARD = "GO_TO_LEADER_BOARD",
  GO_TO_STATS = "GO_TO_STATS",

  GO_BACK = "GO_BACK",

  SUBMIT_HIGHSCORE = "SUBMIT_HIGHSCORE",
  SKIP_SUBMIT_HIGHSCORE = "SKIP_SUBMIT_HIGHSCORE",
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
