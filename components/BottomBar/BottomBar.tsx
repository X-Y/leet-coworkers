import { Box, Button, Container, MediaQuery } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";

interface Props {
  children: React.ReactNode;
}
const BottomBar: React.FC<Props> = ({ children }) => {
  const { ref, entry } = useIntersection({
    threshold: 1,
  });

  return (
    <>
      <MediaQuery
        largerThan={"sm"}
        styles={{
          padding: "1rem 5rem 1rem calc(100vw - 5rem - 20rem)",
          justifyContent: "space-between",
          ">*": {
            flexGrow: 1,
          },
        }}
      >
        <Box
          ref={ref}
          sx={(theme) => ({
            padding: "1rem ",
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",

            position: "sticky",
            bottom: "-1px",
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
      <Box
        sx={(theme) => ({
          borderTop: `1px solid ${theme.colors.leetGreen[6]}`,
        })}
      />
    </>
  );
};

export default BottomBar;
