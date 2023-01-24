import React, { useEffect, useRef, useState } from "react";

import { Input, Box } from "@mantine/core";

interface TextInputAnswerProps {
  name: string;
  onComplete: (val: string) => void;
}
export const TextInputAnswer = ({ name, onComplete }: TextInputAnswerProps) => {
  const letterInputs = useRef<Array<HTMLInputElement | null>>([]);
  const [firstName, ...lastNames] = name.split(" ");
  const letters = firstName.split("");
  const [inputs, setInputs] = useState(() => letters.map(() => "_"));
  const [endReached, setEndReached] = useState(false);

  useEffect(() => {
    letterInputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const onSubmit = (e: KeyboardEvent) => {
      if (e.key === "Enter" && endReached) {
        onComplete(`${inputs.join("")} ${lastNames.join(" ")}`);
      }
    };
    window.addEventListener("keydown", onSubmit);
    return () => {
      window.removeEventListener("keydown", onSubmit);
    };
  }, [endReached]);

  const inputChangeHandler = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    const value = e.key;
    if (value === "Backspace") {
      const newInputs = [...inputs];
      newInputs[id] = "_";
      setInputs(newInputs);
      const next = id - 1;
      if (next >= 0) {
        letterInputs.current[next]?.focus();
      }
    }

    if (value.length > 1) return;

    const newInputs = [...inputs];
    newInputs[id] = value;
    setInputs(newInputs);
    const next = id + 1;
    console.log(next, letterInputs.current.length);
    if (next < letterInputs.current.length) {
      setEndReached(false);
      letterInputs.current[next]?.focus();
    } else {
      console.log("true???");
      setEndReached(true);
    }
  };

  return (
    <div style={{ display: "flex", position: "relative" }}>
      {inputs.map((one, idx) => (
        <Input
          sx={(theme) => ({
            wrapper: {
              display: "inline",
            },
            input: {
              color: theme.colors.leetGreen[6],
              fontSize: "4rem",
              width: "2ch",
              height: "5rem",
              border: "none",
              background: "transparent",
              marginRight: "1rem",
              textAlign: "center",
            },
          })}
          key={"input-" + idx}
          ref={(elm: HTMLInputElement) => (letterInputs.current[idx] = elm)}
          value={one}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            inputChangeHandler(e, idx)
          }
        />
      ))}

      <Box
        sx={(theme) => ({
          color: theme.colors.leetGreen[6],
          fontSize: "4rem",
          position: "absolute",
          right: "-5rem",
        })}
        hidden={!endReached}
      >
        ↵
      </Box>
    </div>
  );
};
