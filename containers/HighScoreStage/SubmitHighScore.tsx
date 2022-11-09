import {
  Box,
  Button,
  Flex,
  Grid,
  TextInput,
  Text,
  Stack,
  Title,
} from "@mantine/core";
import { ref, push, child } from "firebase/database";
import {
  ChangeEvent,
  ChangeEventHandler,
  Fragment,
  useContext,
  useState,
} from "react";

import { GAME_ACTIONS } from "../../interfaces/Game";
import { GameStepProps } from "../../interfaces/GameStepProps";

import { getRealtimeDatabase, getRegionString } from "../../lib/firebase";

import TitleText from "../../components/TitleText/TitleText";
import { MainButton } from "../../components/Button/MainMenuButtons";
import FlagText from "../../components/FlagText/FlagText";

import { KeyContext } from "./HighScoreStage";

const SubmitHighScore: React.FC<Omit<GameStepProps, "gameOverlayDispatch">> = ({
  gameDispatch,
  gameState,
}) => {
  const { setKey } = useContext(KeyContext);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const { region, score } = gameState;

  const noSubmitHighScore = () => {
    gameDispatch({ type: GAME_ACTIONS.SUBMIT_HIGHSCORE });
  };
  const submitHighScore = () => {
    if (!name) {
      setNameError(true);
      return;
    }

    const highScoreValue = {
      name,
      score,
    };

    const database = getRealtimeDatabase();

    const regionString = getRegionString(region);

    const newKey = push(
      ref(database, "highscore/" + regionString),
      highScoreValue
    ).key;

    newKey && setKey(newKey);

    gameDispatch({ type: GAME_ACTIONS.SUBMIT_HIGHSCORE });
  };

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.toUpperCase());
    setNameError(false);
  };

  return (
    <Stack
      spacing={"xl"}
      sx={{
        maxWidth: "40rem",
        width: "100%",
        margin: "auto",
        padding: "0 0.5rem",
      }}
    >
      <TitleText>Submit Your Score</TitleText>
      <FlagText align="center" size={90}>
        {score}
      </FlagText>
      <Text
        sx={(theme) => ({
          color: "white",
          fontSize: theme.fontSizes.xl,
          fontWeight: 600,
          textAlign: "center",
        })}
      >
        Region: {region}
      </Text>
      <TextInput
        type="text"
        label="Your Name:"
        error={nameError ? "Please input your name" : undefined}
        onChange={onChangeName}
        styles={(theme) => ({
          label: {
            color: theme.colors.leetPurple[0],
          },
          root: {
            width: "100%",
            margin: "auto",
          },
        })}
      ></TextInput>
      <Flex justify={"flex-end"} gap="xs">
        <MainButton variant="subtle" onClick={noSubmitHighScore}>
          Skip
        </MainButton>
        <MainButton onClick={submitHighScore}>Submit</MainButton>
      </Flex>
    </Stack>
  );
};

export default SubmitHighScore;
