import { createMachine, assign } from "xstate";

import { Regions, regionType } from "../reducers/gameReducer/gameReducer";
import { Entry, Answer, GAME_ACTIONS } from "../interfaces/Game";
import { Coworker } from "../interfaces/CoworkerModel";

import { generateGameSet } from "./gameActions";
import { calculateScore, saveStats } from "./gameDoneActions";

type GameMachineEvents =
  // MainFlow
  | {
      type: GAME_ACTIONS.CONFIGS_DONE;
      payload?: {
        amount: number;
        confusions: number;
        region: regionType;
      };
    }
  | { type: GAME_ACTIONS.START }
  | { type: GAME_ACTIONS.END; payload: { uncorrectedAnswers: string[] } }
  | { type: GAME_ACTIONS.RESTART }
  | { type: GAME_ACTIONS.BACK_TO_MENU }
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
  confusions: 2,
  region: Regions.Everywhere as regionType,

  score: 0,
  resultDisplayed: false,
  newHighScore: false,
  entries: [] as Entry[],
  answers: [] as Answer[],
};

export const gameFlowMachine = createMachine<
  typeof initState,
  GameMachineEvents
>(
  {
    predictableActionArguments: true,
    id: "game",
    initial: "mainFlow",
    context: { ...initState },
    on: {
      GO_TO_LEADER_BOARD: "overlays.leaderBoardStage",
      GO_TO_STATS: "overlays.statsStage",
    },
    states: {
      mainFlow: {
        initial: "configStage",
        states: {
          configStage: {
            entry: assign({ ...initState }),
            on: {
              CONFIGS_DONE: {
                target: "memoryStage",
                actions: "updateConfigs",
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
        if (event.type !== GAME_ACTIONS.CONFIGS_DONE) throw null;
        if (!event.payload) return {};

        const { amount, confusions, region } = event.payload;
        return { amount, confusions, region };
      }),
      calculateScore: assign((context, event) => {
        if (event.type !== GAME_ACTIONS.END) throw null;
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
