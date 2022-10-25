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
    <Box
      ref={ref}
      sx={{
        padding: "1rem 5rem",
        position: "sticky",
        bottom: "-1px",
        background: "white",
        width: "100%",
        textAlign: "right",
        boxShadow: entry?.isIntersecting ? "" : "0 0 1.5rem lightGrey",
      }}
    >
      {children}
    </Box>
  );
};

export default BottomBar;
