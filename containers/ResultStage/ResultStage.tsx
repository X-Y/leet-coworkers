import {
  Box,
  Button,
  Stack,
  Grid,
  MediaQuery,
  Text,
  Center,
  Title,
  Transition,
} from "@mantine/core";
import confetti from "canvas-confetti";

import { GAME_ACTIONS } from "../../interfaces/Game";
import type {
  GameDispatch,
  GameState,
} from "../../reducers/gameReducer/gameReducer";

import GameResultTile from "../../components/GameResultTile/GameResultTile";
import BottomBar from "../../components/BottomBar/BottomBar";

import { useEffect, useRef, useState } from "react";
interface ResultStageProps {
  gameState: GameState;
  gameDispatch: GameDispatch;
}

enum STAGES {
  BEFORE_DONE,
  DONE,
  DONE_END,
  YOUR_SCORE_IS,
  SCORE_DISPLAY,
  RESULT_DISPLAY,
}

const stageTimers = [500, 1000, 500, 1000, 1200];

const randomConfetti = () => {
  confetti({ origin: { y: 1, x: Math.random() }, startVelocity: 60 });
};

const ResultStage: React.FC<ResultStageProps> = ({
  gameState,
  gameDispatch,
}) => {
  const timerRef = useRef<NodeJS.Timeout>();
  const confettiTimerRef = useRef<NodeJS.Timeout>();
  const [stage, setStage] = useState<STAGES>(STAGES.BEFORE_DONE);
  const { entries, answers, score } = gameState;

  const [testStarter, setTestStarter] = useState(false);

  const onClick = () => {
    gameDispatch({ type: GAME_ACTIONS.RESTART });
  };

  const triggerNextStage = (stageNum: number = 0) => {
    const tid = setTimeout(() => {
      const next = stageNum + 1;
      if (next <= STAGES.RESULT_DISPLAY) {
        console.log(next);
        triggerNextStage(next);
        setStage(next);
      }
    }, stageTimers[stageNum]);

    timerRef.current = tid;
  };
  const startConfetti = () => {
    randomConfetti();
    const tid = setTimeout(() => {
      startConfetti();
    }, Math.random() * 700);
    confettiTimerRef.current = tid;
  };
  useEffect(() => {
    startConfetti();
    setStage(0);
    triggerNextStage(0);

    return () => {
      clearTimeout(confettiTimerRef.current);
      clearTimeout(timerRef.current);
    };
  }, [testStarter]);

  const onGameRestartClick = () => {
    gameDispatch({ type: GAME_ACTIONS.RESTART });
  };

  return (
    <>
      <div style={{ position: "fixed", top: "0", display: "none" }}>
        {Array(6)
          .fill(0)
          .map((one, idx) => (
            <button key={idx} onClick={() => setStage(idx)}>
              {idx}
            </button>
          ))}

        <button onClick={() => setTestStarter((prev) => !prev)}>Restart</button>
        <button onClick={() => randomConfetti()}>Confetti</button>
      </div>

      <Center>
        <Stack>
          <Transition
            mounted={stage === STAGES.DONE}
            transition="pop"
            timingFunction="cubic-bezier(0.68, -0.6, 0.32, 4)"
          >
            {(styles) => (
              <Center style={{ ...styles, marginTop: "30vh" }}>
                <Title
                  size={90}
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan", deg: 15 }}
                >
                  Done!
                </Title>
              </Center>
            )}
          </Transition>
          <Transition
            mounted={stage >= STAGES.YOUR_SCORE_IS}
            transition="fade"
            timingFunction="ease-in"
          >
            {(styles) => (
              <Title
                size={60}
                variant="gradient"
                gradient={{ from: "cyan", to: "blue", deg: 15 }}
                style={{ ...styles, marginTop: "20vh" }}
              >
                Your score is:
              </Title>
            )}
          </Transition>
          <Transition
            mounted={stage >= STAGES.SCORE_DISPLAY}
            transition="fade"
            timingFunction="ease-in"
          >
            {(styles) => (
              <Title
                size={90}
                variant="gradient"
                gradient={{ from: "cyan", to: "blue", deg: 15 }}
                style={{
                  ...styles,
                  textAlign: "center",
                  marginBottom: "20vh",
                }}
              >
                {score} / {entries.length}
              </Title>
            )}
          </Transition>
        </Stack>
      </Center>
      <Transition
        mounted={stage >= STAGES.RESULT_DISPLAY}
        transition="fade"
        timingFunction="ease-in"
      >
        {(styles) => (
          <Box style={styles}>
            <MediaQuery
              largerThan="xs"
              styles={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, 300px)",
                gap: "2rem",
                justifyContent: "center",
              }}
            >
              <Box sx={{ padding: "2rem", marginBottom: "2rem" }}>
                {entries.map((one, idx) => (
                  <GameResultTile
                    key={idx}
                    coworker={one}
                    answer={answers[idx][0]}
                    isCorrect={answers[idx][1]}
                  />
                ))}
              </Box>
            </MediaQuery>
            <BottomBar>
              <Button
                sx={{ padding: "0 4rem" }}
                size="lg"
                onClick={onGameRestartClick}
              >
                Restart!
              </Button>
            </BottomBar>
          </Box>
        )}
      </Transition>
    </>
  );
};

export default ResultStage;
