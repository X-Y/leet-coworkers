import { Box } from "@mantine/core";
import { useEffect, useRef } from "react";
import { HeadsBackground } from "./HeadsBackground";

const bgMoveVector = Math.sqrt((25 * 25) / 2);
const period = 3000;

const AnimatedBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const animationTimerRef = useRef<NodeJS.Timeout>();

  function animate() {
    if (!ref.current) {
      return;
    }

    const now = Date.now();
    const offset = (-1 + (now % period) / period) * bgMoveVector;
    ref.current.style.backgroundPosition = `${offset}px ${offset}px`;

    animationTimerRef.current = setTimeout(() => {
      animationRef.current = window.requestAnimationFrame(animate);
    }, 160);
  }

  useEffect(() => {
    animate();

    return () => {
      animationRef.current && window.cancelAnimationFrame(animationRef.current);
      clearTimeout(animationTimerRef.current);
    };
  }, []);

  return (
    <Box
      ref={ref}
      sx={(theme) => ({
        height: "calc(100vh + 20px)",
        width: "calc(100vw + 20px)",

        position: "fixed",

        backgroundColor: theme.colors.leetPurple[6],
        background:
          "repeating-linear-gradient( -45deg, #1E1E9D, #1E1E9D 2px, #0c0c91 2px, #0c0c91 25px )",
      })}
    ></Box>
  );
};

interface Props {
  children: React.ReactNode;
}
const GameBackground: React.FC<Props> = ({ children }) => {
  return (
    <div style={{ position: "relative" }}>
      <AnimatedBackground />
      <HeadsBackground />

      <Box
        sx={(theme) => ({
          minHeight: "100vh",
          position: "relative",
        })}
      >
        {children}
      </Box>
    </div>
  );
};

export default GameBackground;
