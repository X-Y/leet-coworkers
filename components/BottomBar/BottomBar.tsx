import { Box, Button, Container } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";

interface Props {
  children: JSX.Element;
}
const BottomBar: React.FC<Props> = ({ children }) => {
  const { ref, entry } = useIntersection({
    threshold: 1,
  });

  return (
    <>
      <Box
        ref={ref}
        sx={(theme) => ({
          padding: "1rem 5rem",
          position: "sticky",
          bottom: "-1px",
          background: theme.colors.leetGreen[6],
          width: "100%",
          textAlign: "right",
          boxShadow: entry?.isIntersecting
            ? ""
            : "0 0 1.5rem " + theme.colors.leetGreen[7],
        })}
      >
        {children}
      </Box>
      <Box
        sx={(theme) => ({
          marginTop: "-1px",
          borderTop: `1px solid transparent`,
        })}
      />
    </>
  );
};

export default BottomBar;
