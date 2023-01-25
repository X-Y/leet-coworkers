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
    letterInputs.current[0]?.setSelectionRange(0, 0);
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
    const inputVal = value === null ? "_" : value.charAt(value.length - 1);
    newInputs[id] = inputVal;

    setInputs(newInputs);
    if (!"`´¨^~".includes(inputVal)) e.currentTarget.value = inputVal;

    // Backspace pressed
    if (value === null) {
      const next = Math.max(id - 1, 0);
      setEndReached(false);
      letterInputs.current[next]?.focus();
      letterInputs.current[0]?.setSelectionRange(1, 1);
      return;
    }
  };
  const keyDownHandler = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    const value = e.key;
    if ("aeious".includes(value.toLowerCase())) {
      // When a key is long pressed, it will keep firing keydown events. The 2nd event
      // indicates that it is being held down, which conveniently fires up the accent menu
      longPressRef.current++;
    }
  };

  const keyUpHandler = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    // See comments in keyDownHandler about longPressRef
    if (longPressRef.current >= 2) {
      longPressRef.current = 0;
      return;
    }
    longPressRef.current = 0;

    const value = e.key;

    // key will be "Shift", "Dead" etc if it's a control/accent key
    // In Firefox the accent keys are fired as they are
    if (value.length > 1 || "`´¨^~".includes(value)) return;

    const next = id + 1;
    if (next < letterInputs.current.length) {
      setEndReached(false);

      letterInputs.current[next]?.focus();
    } else {
      setEndReached(true);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        margin: "0 1rem",
      }}
    >
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
              textAlign: "center",
            },
          })}
          key={"input-" + idx}
          ref={(elm: HTMLInputElement) => (letterInputs.current[idx] = elm)}
          //value={one}
          defaultValue={"_"}
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
          color: endReached ? theme.colors.leetGreen[6] : "transparent",
          fontSize: "4rem",
          width: "0",
        })}
      >
        ↵
      </Box>
    </div>
  );
};
