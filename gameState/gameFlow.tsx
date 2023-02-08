import { createMachine, assign } from "xstate";

import { Regions, regionType } from "../reducers/gameReducer/gameReducer";
import { Entry, Answer, GAME_ACTIONS, GAME_MODE } from "../interfaces/Game";
import { Coworker } from "../interfaces/CoworkerModel";

import { generateGameSet } from "./generateGameSetActions";
import { calculateScore, saveStats } from "./gameDoneActions";

type GameMachineEvents =
  // Login
  | { type: GAME_ACTIONS.LOGGED_IN }
  // MainFlow
  | { type: GAME_ACTIONS.START }
  | { type: GAME_ACTIONS.END; payload: { uncorrectedAnswers: string[] } }
  | { type: GAME_ACTIONS.RESTART }
  | { type: GAME_ACTIONS.BACK_TO_MENU }
  // MainFlow - configs
  | {
      type: GAME_ACTIONS.GO_TO_MODES;
      payload: {
        amount: number;
        region: regionType;
      };
    }
  | {
      type: GAME_ACTIONS.MODE_SELECTED;
      payload: {
        gameMode: GAME_MODE.OPTIONS;
        confusions: number;
        revealByClick: boolean;
      };
    }
  | {
      type: GAME_ACTIONS.MODE_SELECTED;
      payload: {
        gameMode: GAME_MODE.TYPE;
      };
    }
  | { type: GAME_ACTIONS.GO_TO_SETTINGS }

  // mainFlow - sub events
  | {
      type: GAME_ACTIONS.GENERATE;
      payload: {
        data: Coworker[];
      };
    }
  | {
      type: GAME_ACTIONS.RESULT_DISPLAYED;
    }
  // to Overlays
  | { type: GAME_ACTIONS.GO_TO_LEADER_BOARD }
  | { type: GAME_ACTIONS.GO_TO_STATS }
  // Overlays
  | { type: GAME_ACTIONS.GO_BACK }
  // leaderBoardStage
  | { type: GAME_ACTIONS.SUBMIT_HIGHSCORE };

const initState = {
  amount: 10,
  region: Regions.Everywhere as regionType,

  score: 0,
  resultDisplayed: false,
  newHighScore: false,
  entries: [] as Entry[],
  answers: [] as Answer[],

  gameMode: "options" as GAME_MODE,
  confusions: 2,
  revealByClick: false,
};

export const gameFlowMachine = createMachine<
  typeof initState,
  GameMachineEvents
>(
  {
    predictableActionArguments: true,
    id: "game",
    initial: "login",
    context: { ...initState },
    on: {
      GO_TO_LEADER_BOARD: "overlays.leaderBoardStage",
      GO_TO_STATS: "overlays.statsStage",
    },
    states: {
      login: {
        on: {
          LOGGED_IN: "mainFlow",
        },
      },
      mainFlow: {
        initial: "configStage",
        states: {
          configStage: {
            initial: "main",
            entry: assign({ ...initState }),
            onDone: "memoryStage",
            states: {
              main: {
                on: {
                  GO_TO_MODES: {
                    target: "modes",
                    actions: "updateConfigs",
                  },
                  GO_TO_SETTINGS: "settings",
                },
              },
              modes: {
                on: {
                  MODE_SELECTED: {
                    target: "configDone",
                    actions: "updateMode",
                  },
                  GO_BACK: "main",
                },
              },
              configDone: {
                type: "final",
              },

              settings: {
                on: {
                  GO_BACK: "main",
                },
              },
            },
          },
          memoryStage: {
            initial: "idle",
            entry: "resetResults",
            on: {
              START: "playStage",
              GENERATE: ".generating",
            },
            states: {
              idle: {},
              generating: {
                invoke: {
                  src: "makeNewGame",
                  onDone: {
                    target: "idle",
                    actions: assign({
                      entries: (_, { data }) => data,
                    }),
                  },
                },
              },
            },
          },
          playStage: {
            exit: ["calculateScore", "saveStats"],
            on: {
              END: "highScoreStage",
            },
          },
          highScoreStage: {
            on: {
              RESTART: "memoryStage",
              BACK_TO_MENU: "configStage",
              RESULT_DISPLAYED: {
                actions: assign({ resultDisplayed: true }),
              },
            },
          },
          hist: {
            type: "history",
          },
        },
      },
      overlays: {
        on: {
          GO_BACK: "mainFlow.hist",
        },
        states: {
          leaderBoardStage: {
            initial: "init",
            states: {
              init: {
                always: [
                  {
                    target: "leaderBoard",
                    cond: ({ newHighScore }) => !newHighScore,
                  },
                  {
                    target: "submitPage",
                    cond: ({ newHighScore }) => newHighScore,
                  },
                ],
              },
              leaderBoard: {},
              submitPage: {
                on: {
                  SUBMIT_HIGHSCORE: {
                    target: "leaderBoard",
                    actions: [assign({ newHighScore: false })],
                  },
                },
              },
            },
          },
          statsStage: {},
        },
      },
    },
  },

  {
    actions: {
      updateConfigs: assign((context, event) => {
        if (event.type !== GAME_ACTIONS.GO_TO_MODES)
          throw event.type + "in updateConfigs";
        if (!event.payload) return {};

        const { amount, region } = event.payload;
        return { amount, region };
      }),
      updateMode: assign((context, event) => {
        if (event.type !== GAME_ACTIONS.MODE_SELECTED)
          throw event.type + "in updateMode";
        const { gameMode } = event.payload;
        if (gameMode === GAME_MODE.OPTIONS) {
          const { revealByClick, confusions } = event.payload;
          return { revealByClick, confusions, gameMode };
        } else if (gameMode === GAME_MODE.TYPE) {
          return { gameMode };
        }
        throw "no more modes";
      }),
      calculateScore: assign((context, event) => {
        if (event.type !== GAME_ACTIONS.END)
          throw event.type + "in calculateScore";
        const { uncorrectedAnswers } = event.payload;
        const [score, correctedAnswers] = calculateScore(
          uncorrectedAnswers,
          context.entries
        );

        return {
          score,
          newHighScore: true,
          answers: correctedAnswers,
        };
      }),
      saveStats: (context, event) => {
        const { entries, answers } = context;
        saveStats(entries, answers);
      },

      resetResults: assign({
        score: 0,
        resultDisplayed: false,
        newHighScore: false,
        entries: [] as Entry[],
        answers: [] as Answer[],
      }),
    },
    services: {
      makeNewGame: (context, event) => {
        if (event.type !== GAME_ACTIONS.GENERATE)
          throw event.type + "in makeNewGame";
        const { data } = event.payload;
        const { amount, confusions, region } = context;
        return generateGameSet(data, amount, confusions, region);
      },
    },
  }
);
