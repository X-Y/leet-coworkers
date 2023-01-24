import { Box, Button, Container, MediaQuery } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { motion } from "framer-motion";
import React, { CSSProperties, PropsWithChildren, useContext } from "react";
import { useActor } from "@xstate/react";

import { GAME_ACTIONS } from "../../interfaces/Game";

import GameXstateContext from "../../contexts/GameXstateContext/GameXstateContext";

interface Props extends PropsWithChildren {
  motionRef?: React.ForwardedRef<HTMLDivElement>;
  style?: CSSProperties;
  hasBack?: boolean;
}
const BottomBar: React.FC<Props> = ({
  motionRef,
  style,
  hasBack,
  children,
}) => {
  const gameService = useContext(GameXstateContext);
  const [, send] = useActor(gameService.gameService);

  const { ref: itsRef, entry } = useIntersection({
    threshold: 1,
  });

  const onGameBackClick = () => {
    send({ type: GAME_ACTIONS.GO_BACK });
  };

  return (
    <>
      <Box
        ref={itsRef}
        sx={(theme) => ({
          position: "sticky",
          bottom: "-1px",

          width: "100%",
        })}
      >
        <MediaQuery
          largerThan={"sm"}
          styles={{
            justifyContent: "flex-end",
            ">*": {
              flexGrow: 1,
            },
          }}
        >
          <Box
            ref={motionRef}
            sx={(theme) => ({
              padding: "1rem ",
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              "> *": {
                flexGrow: 1,
                maxWidth: "10rem",
              },

              background: theme.colors.leetGreen[6],
              width: "100%",

              boxShadow: entry?.isIntersecting
                ? ""
                : "0 0 1.5rem " + theme.colors.leetGreen[7],
            })}
          >
            {children}

            {hasBack && (
              <Button
                color="leetPurple"
                variant="light"
                size="lg"
                onClick={onGameBackClick}
              >
                Back
              </Button>
            )}
          </Box>
        </MediaQuery>
      </Box>
      <Box
        sx={(theme) => ({
          borderTop: `1px solid ${theme.colors.leetGreen[6]}`,
        })}
      />
    </>
  );
};

export default BottomBar;

const _BottomBar = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children, ...otherProps } = props;
  return (
    <BottomBar motionRef={ref} {...otherProps}>
      {children}
    </BottomBar>
  );
});
export const MotionBottomBar = motion(_BottomBar);
