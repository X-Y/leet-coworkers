import { motion } from "framer-motion";
import { Box } from "@mantine/core";

const Spinner = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div
        animate={{
          rotate: ["90deg", "180deg", "270deg"],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{}}
      >
        <Box
          sx={(theme) => ({
            width: "2rem",
            height: "0.25rem",
            clipPath: "polygon(0 0,90% 0,100% 100%,10% 100%)",
            transform: "scale(3.5)",
            background: theme.colors.leetGreen[6],
          })}
        ></Box>
      </motion.div>
    </Box>
  );
};

export default Spinner;
