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
import { motion } from "framer-motion";

import { GAME_ACTIONS } from "../../interfaces/Game";
import type {
  GameDispatch,
  GameState,
} from "../../reducers/gameReducer/gameReducer";

import GameResultTile from "../../components/GameResultTile/GameResultTile";
import BottomBar from "../../components/BottomBar/BottomBar";
import FlagText from "../../components/FlagText/FlagText";

import { useEffect, useRef, useState } from "react";
interface ResultStageProps {
  gameState: GameState;
  gameDispatch: GameDispatch;
}

enum STAGES {
  DONE,
  YOUR_SCORE_IS,
  SCORE_DISPLAY,
  RESULT_DISPLAY,
}

const randomConfetti = () => {
  confetti({ origin: { y: 1, x: Math.random() }, startVelocity: 60 });
};

const GradientText = {
  variant: "gradient" as "gradient",
  gradient: {
    from: "white",
    to: "leetPurple.0",
    deg: 15,
  },
};

const ResultStage: React.FC<ResultStageProps> = ({
  gameState,
  gameDispatch,
}) => {
  const confettiTimerRef = useRef<NodeJS.Timeout>();
  const [stage, setStage] = useState<STAGES>(STAGES.DONE);
  const { entries, answers, score } = gameState;

  const [testStarter, setTestStarter] = useState(false);

  const onClick = () => {
    gameDispatch({ type: GAME_ACTIONS.RESTART });
  };

  const startConfetti = () => {
    if (!document.hidden) {
      randomConfetti();
    }
    const tid = setTimeout(() => {
      startConfetti();
    }, Math.random() * 700);
    confettiTimerRef.current = tid;
  };

  useEffect(() => {
    startConfetti();

    setStage(0);

    return () => {
      clearTimeout(confettiTimerRef.current);
    };
  }, [testStarter, setStage]);

  // Remove confetti after Results have been shown
  useEffect(() => {
    let tid: NodeJS.Timeout;
    if (stage >= STAGES.RESULT_DISPLAY) {
      tid = setTimeout(() => {
        clearTimeout(confettiTimerRef.current);
      }, 3000);
    }

    return () => {
      clearTimeout(tid);
    };
  }, [stage]);

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
          {stage === STAGES.DONE && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                ease: "easeOut",
                duration: 0.5,
                repeat: 1,
                repeatDelay: 0.5,
                repeatType: "reverse",
              }}
              onAnimationComplete={() => setStage(STAGES.YOUR_SCORE_IS)}
            >
              <Center style={{ marginTop: "30vh" }}>
                <Title size={90} {...GradientText}>
                  Done!
                </Title>
              </Center>
            </motion.div>
          )}

          {stage >= STAGES.YOUR_SCORE_IS && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.3,
              }}
              onAnimationComplete={() => setStage(STAGES.SCORE_DISPLAY)}
            >
              <Title
                size={60}
                {...GradientText}
                style={{ margin: "20vh 2rem 0" }}
              >
                Your score is:
              </Title>
            </motion.div>
          )}

          {stage >= STAGES.SCORE_DISPLAY && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 1,
              }}
              onAnimationComplete={() => setStage(STAGES.RESULT_DISPLAY)}
            >
              <FlagText
                size={90}
                style={{
                  textAlign: "center",
                  marginBottom: "10vh",
                  filter: "drop-shadow(8px 12px black)",
                }}
              >
                {score} / {entries.length}
              </FlagText>
            </motion.div>
          )}
        </Stack>
      </Center>

      {stage >= STAGES.RESULT_DISPLAY && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1.5,
          }}
        >
          <Box>
            <MediaQuery
              largerThan="xs"
              styles={{
                gridTemplateColumns: "repeat(auto-fill, 300px)",
                gap: "2rem",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  padding: "2rem",
                  marginBottom: "2rem",
                  gap: "2rem",
                }}
              >
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
                color="leetPurple"
                sx={{ padding: "0 4rem" }}
                size="lg"
                onClick={onGameRestartClick}
              >
                Restart!
              </Button>
            </BottomBar>
          </Box>
        </motion.div>
      )}
    </>
  );
};

export default ResultStage;
