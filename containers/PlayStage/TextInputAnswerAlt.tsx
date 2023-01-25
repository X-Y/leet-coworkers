import React, {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { Input, Box } from "@mantine/core";

interface TextInputAnswerProps {
  name: string;
  onComplete: (val: string) => void;
}
export const TextInputAnswer = ({ name, onComplete }: TextInputAnswerProps) => {
  const letterInput = useRef<HTMLInputElement>(null);
  const [firstName, ...lastNames] = name.split(" ");
  const [input, setInput] = useState(
    Array(firstName.length).fill("_").join("")
  );
  const [endReached, setEndReached] = useState(false);

  useEffect(() => {
    letterInput.current?.focus();
    letterInput.current?.setSelectionRange(0, 0);
  }, []);
  useEffect(() => {
    const onSubmit = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onComplete(`${input} ${lastNames.join(" ")}`);
      }
    };
    window.addEventListener("keydown", onSubmit);
    return () => {
      window.removeEventListener("keydown", onSubmit);
    };
  }, [endReached, input]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let selectionStart = e.target.selectionStart || 0;
    //if(!selectionStart) throw 'no selection'

    let newValue = "";
    if (value.length >= input.length) {
      // Allow dead keys to work - should be at most one
      const lastChar = value.charAt(selectionStart - 1);
      if ("`´¨^~".includes(lastChar)) {
        if (value.match(/[`´¨^~]/g)?.length === 1) {
          return;
        }
      }

      // Remove dead keys that didn't work
      const removes = value.match(/[`´¨^~]/g);
      if (removes?.length) {
        value = value.replaceAll(/[`´¨^~]/g, "");
        selectionStart -= removes.length;
      }

      if (value.length === input.length) {
        newValue = value;
      } else {
        newValue =
          value.substring(0, Math.min(selectionStart, input.length)) +
          value.substring(selectionStart + 1, value.length);
      }
    } else if (value.length < input.length) {
      const deleted = input.length - value.length;
      newValue =
        value.substring(0, selectionStart) +
        "_".repeat(deleted) +
        value.substring(selectionStart, value.length);
    }
    console.log("newVal", newValue);
    setInput(newValue);
    e.target.value = newValue;
    e.target.setSelectionRange(selectionStart, selectionStart);

    if (newValue.replaceAll("_", "").length === firstName.length) {
      setEndReached(true);
    } else {
      setEndReached(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        maxWidth: "80vw",
      }}
    >
      <Input
        sx={(theme) => ({
          wrapper: {
            display: "inline",
          },
          input: {
            color: theme.colors.leetGreen[6],
            fontSize: "4rem",
            height: "5rem",
            border: "none",
            width: firstName.length * 4 + "rem",
            background: "transparent",
            textAlign: "center",
            letterSpacing: "1rem",
          },
        })}
        ref={letterInput}
        //value={one}
        defaultValue={input}
        onChange={onChange}
      />

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
