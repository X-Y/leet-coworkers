import { Button } from "@mantine/core";
import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { GAME_ACTIONS } from "../../interfaces/Game";

import GameXstateContext from "../../contexts/GameXstateContext/GameXstateContext";

export const BackButton = () => {
  const gameService = useContext(GameXstateContext);
  const [, send] = useActor(gameService.gameService);

  const onGameBackClick = () => {
    send({ type: GAME_ACTIONS.GO_BACK });
  };
  return (
    <Button
      color="leetPurple"
      variant="light"
      size="lg"
      onClick={onGameBackClick}
    >
      Back
    </Button>
  );
};

export default BackButton;
