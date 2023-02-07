import { createMachine, assign } from "xstate";

import { Regions, regionType } from "../reducers/gameReducer/gameReducer";
import { Entry, Answer, GAME_ACTIONS } from "../interfaces/Game";
import { Coworker } from "../interfaces/CoworkerModel";

import { generateGameSet } from "./generateGameSetActions";
import { calculateScore, saveStats } from "./gameDoneActions";

type GameMachineEvents =
  // Login
  | { type: GAME_ACTIONS.LOGGED_IN }
  // MainFlow
  | { type: GAME_ACTIONS.CONFIGS_DONE }
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
        gameMode: "options";
        confusions: number;
        revealByClick: boolean;
      };
    }
  | {
      type: GAME_ACTIONS.MODE_SELECTED;
      payload: {
        gameMode: "type";
      };
    }
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
  | { type: GAME_ACTIONS.GO_TO_SETTINGS }
  | { type: GAME_ACTIONS.SET_REVEAL_BY_CLICK; payload: { value: boolean } }
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

  gameMode: "options" as "options" | "type",
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
            on: {
              CONFIGS_DONE: {
                target: "memoryStage",
              },
            },
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
                    actions: "updateMode",
                  },
                  GO_BACK: "main",
                },
              },
              settings: {
                on: {
                  SET_REVEAL_BY_CLICK: {
                    actions: "setRevealByClick",
                  },
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
              GENERATE: ".generating", //{actions: 'makeNewGame'},
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
        if (event.type !== GAME_ACTIONS.GO_TO_MODES) throw "updateConfigs";
        if (!event.payload) return {};

        const { amount, region } = event.payload;
        return { amount, region };
      }),
      updateMode: assign((context, event) => {
        if (event.type !== GAME_ACTIONS.MODE_SELECTED) throw "updateMode";
        const { gameMode } = event.payload;
        if (gameMode === "options") {
          const { revealByClick, confusions } = event.payload;
          return { revealByClick, confusions, gameMode };
        } else if (gameMode === "type") {
          return { gameMode };
        }
        throw "no more modes";
      }),
      setRevealByClick: assign((context, event) => {
        if (event.type !== GAME_ACTIONS.SET_REVEAL_BY_CLICK)
          throw "setRevealByClick";
        return { revealByClick: event.payload.value };
      }),
      calculateScore: assign((context, event) => {
        if (event.type !== GAME_ACTIONS.END) throw "calculateScore";
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
        if (event.type !== GAME_ACTIONS.GENERATE) throw null;
        const { data } = event.payload;
        const { amount, confusions, region } = context;
        return generateGameSet(data, amount, confusions, region);
      },
    },
  }
);
