import { Text, Stack, Box } from "@mantine/core";
import { motion } from "framer-motion";

interface Props {
  onClick: () => void;
}
const SubmitHighScoreBtn: React.FC<Props> = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        ":hover": {
          transform: "scale(1.5)",
        },
      }}
    >
      <motion.div
        initial={{ y: -5 }}
        animate={{ y: 5 }}
        transition={{
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1,
        }}
      >
        <Stack spacing={0}>
          👆
          <Text weight={"bold"} color={"leetGreen.4"}>
            Submit HighScore!
          </Text>
        </Stack>
      </motion.div>
    </Box>
  );
};

export default SubmitHighScoreBtn;
