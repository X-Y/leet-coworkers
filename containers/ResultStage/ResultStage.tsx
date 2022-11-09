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

import { GAME_ACTIONS, GAME_OVERLAY_ACTIONS } from "../../interfaces/Game";
import { GameStepProps } from "../../interfaces/GameStepProps";

import GameResultTile from "../../components/GameResultTile/GameResultTile";
import BottomBar from "../../components/BottomBar/BottomBar";
import FlagText from "../../components/FlagText/FlagText";

import { useEffect, useRef, useState } from "react";
import TitleText from "../../components/TitleText/TitleText";
import SubmitHighScoreBtn from "./SubmitHighScoreBtn";

enum STAGES {
  DONE,
  YOUR_SCORE_IS,
  SCORE_DISPLAY,
  RESULT_DISPLAY,
  SUBMIT_DISPLAY,
}

const randomConfetti = () => {
  confetti({ origin: { y: 1, x: Math.random() }, startVelocity: 60 });
};

const ResultStage: React.FC<GameStepProps> = ({
  gameState,
  gameDispatch,
  gameOverlayDispatch,
}) => {
  const confettiTimerRef = useRef<NodeJS.Timeout>();
  const [stage, setStage] = useState<STAGES>(STAGES.DONE);
  const { entries, answers, score, newHighScore } = gameState;

  const [testStarter, setTestStarter] = useState(false);

  const startConfetti = () => {
    if (!document.hidden) {
      randomConfetti();
    }
    const tid = setTimeout(() => {
      startConfetti();
    }, Math.random() * 700);
    confettiTimerRef.current = tid;
  };

  const isFirstVisit = newHighScore;

  useEffect(() => {
    if (!isFirstVisit) {
      setStage(STAGES.SUBMIT_DISPLAY);
    } else {
      startConfetti();
      setStage(0);
    }

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

  const onShowStatsClick = () => {
    gameOverlayDispatch({ type: GAME_OVERLAY_ACTIONS.SHOW_STATS });
  };
  const onGameMenuClick = () => {
    gameDispatch({ type: GAME_ACTIONS.RESTART });
  };
  const onGameRestartClick = () => {
    gameDispatch({ type: GAME_ACTIONS.CONFIGS_DONE });
  };
  const onSubmitHighScoreClick = () => {
    gameOverlayDispatch({ type: GAME_OVERLAY_ACTIONS.SHOW_HIGHSCORE });
  };

  const motionAppear = {
    initial: isFirstVisit && { opacity: 0 },
    animate: { opacity: 1 },
  };

  return (
    <>
      <div style={{ position: "fixed", top: "0", display: "none" }}>
        {Array(4)
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
            <Center style={{ marginTop: "30vh" }}>
              <motion.div
                initial={isFirstVisit && { opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  ease: [0.24, 0.0, 0.395, 1.61],
                  duration: 0.5,
                  repeat: 1,
                  repeatDelay: 0.5,
                  repeatType: "reverse",
                }}
                onAnimationComplete={() => setStage(STAGES.YOUR_SCORE_IS)}
              >
                <TitleText>Done!</TitleText>
              </motion.div>
            </Center>
          )}

          {stage >= STAGES.YOUR_SCORE_IS && (
            <motion.div
              {...motionAppear}
              transition={{
                delay: 0.3,
              }}
              onAnimationComplete={() => setStage(STAGES.SCORE_DISPLAY)}
            >
              <TitleText style={{ margin: "20vh 2rem 0" }}>
                Your score is:
              </TitleText>
            </motion.div>
          )}

          {stage >= STAGES.SCORE_DISPLAY && (
            <div style={{ position: "relative", marginBottom: "10vh" }}>
              <motion.div
                {...motionAppear}
                transition={{
                  delay: 1.5,
                }}
                onAnimationComplete={() => setStage(STAGES.RESULT_DISPLAY)}
              >
                <FlagText
                  size={90}
                  style={{
                    textAlign: "center",
                    filter: "drop-shadow(8px 12px black)",
                  }}
                >
                  {score} / {entries.length}
                </FlagText>
                {stage >= STAGES.SUBMIT_DISPLAY && newHighScore && (
                  <motion.div
                    style={{
                      position: "absolute",
                      transform: "translateX(-50%)",
                      marginLeft: "50%",
                      textAlign: "center",
                    }}
                    {...motionAppear}
                    transition={{
                      delay: 0.9,
                    }}
                  >
                    <SubmitHighScoreBtn onClick={onSubmitHighScoreClick} />
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}
        </Stack>
      </Center>

      {stage >= STAGES.RESULT_DISPLAY && (
        <motion.div
          {...motionAppear}
          transition={{
            delay: 1,
          }}
          onAnimationComplete={() => setStage(STAGES.SUBMIT_DISPLAY)}
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
                variant="light"
                size="lg"
                style={{ padding: 0 }}
                onClick={onGameMenuClick}
              >
                Menu
              </Button>
              <Button
                color="leetPurple"
                variant="light"
                size="lg"
                style={{ padding: 0 }}
                onClick={onShowStatsClick}
              >
                Stats
              </Button>

              <Button
                color="leetPurple"
                variant="light"
                size="lg"
                style={{ padding: 0 }}
                onClick={onSubmitHighScoreClick}
              >
                HighScore
              </Button>
              <Button
                color="leetPurple"
                size="lg"
                style={{ padding: 0 }}
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
