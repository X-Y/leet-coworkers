import React, { SyntheticEvent, useEffect, useRef, useState } from "react";

import { Input, Box } from "@mantine/core";

interface TextInputAnswerProps {
  name: string;
  onComplete: (val: string) => void;
}
export const TextInputAnswer = ({ name, onComplete }: TextInputAnswerProps) => {
  const longPressRef = useRef(0);
  const letterInputs = useRef<Array<HTMLInputElement | null>>([]);
  const [firstName, ...lastNames] = name.split(" ");
  const letters = firstName.split("");
  const [inputs, setInputs] = useState(() => letters.map(() => "_"));
  const [endReached, setEndReached] = useState(false);

  useEffect(() => {
    letterInputs.current[0]?.focus();
    letterInputs.current[0]?.select();
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
    e: SyntheticEvent<HTMLInputElement, InputEvent>,
    id: number
  ) => {
    const value = e.nativeEvent.data;
    const newInputs = [...inputs];
    newInputs[id] = value === null ? "_" : value.charAt(value.length - 1);

    setInputs(newInputs);

    if (value === null) {
      const next = Math.max(id - 1, 0);
      setEndReached(false);
      letterInputs.current[next]?.focus();
      letterInputs.current[next]?.select();

      return;
    }
  };
  const keyDownHandler = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    const value = e.key;
    if ("aeious".includes(value)) {
      // When a key is long pressed, it will keep firing keydown events. The 2nd event
      // indicates that it is being held down, which conveniently fires up the accent menu
      longPressRef.current++;
    }
  };

  const keyUpHandler = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (longPressRef.current >= 2) {
      longPressRef.current = 0;
      return;
    }
    longPressRef.current = 0;

    const value = e.key;
    // key will be "Shift", "Dead" etc if it's a control/accent key
    if (value.length > 1) return;

    const next = id + 1;
    if (next < letterInputs.current.length) {
      setEndReached(false);

      letterInputs.current[next]?.focus();
      letterInputs.current[next]?.select();
    } else {
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
          onInput={(e: SyntheticEvent<HTMLInputElement, InputEvent>) =>
            inputChangeHandler(e, idx)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            keyDownHandler(e, idx)
          }
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
            keyUpHandler(e, idx)
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
