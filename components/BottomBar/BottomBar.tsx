import { Box, Button, Container, MediaQuery } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { motion } from "framer-motion";
import React, { CSSProperties } from "react";

interface Props {
  motionRef?: React.ForwardedRef<HTMLDivElement>;
  children: React.ReactNode;
  style?: CSSProperties;
}
const BottomBar: React.FC<Props> = ({ motionRef, style, children }) => {
  const { ref: itsRef, entry } = useIntersection({
    threshold: 1,
  });

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
  return <BottomBar motionRef={ref}>{props.children}</BottomBar>;
});
export const MotionBottomBar = motion(_BottomBar);
