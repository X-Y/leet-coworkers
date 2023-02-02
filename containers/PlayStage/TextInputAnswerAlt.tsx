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
    if (!("ontouchstart" in document.documentElement)) {
      letterInput.current?.focus();
      letterInput.current?.setSelectionRange(0, 0);
    }
  }, []);
  useEffect(() => {
    const onSubmit = (e: KeyboardEvent) => {
      if (e.key === "Enter" && endReached) {
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
    setInput(newValue);
    e.target.value = newValue;
    e.target.setSelectionRange(selectionStart, selectionStart);

    if (newValue.replaceAll("_", "").length === firstName.length) {
      setEndReached(true);
    } else {
      setEndReached(false);
    }
  };

  //Fontsize range
  const fsMa = 3.3;
  const fsMi = 1.6;
  //Number of character range
  const numMi = 5;
  const numMa = 10;
  //Scale range
  const scMi = 1;
  const scMa = 1.6;
  // viewPort range
  const vpMi = 400;
  const vpMa = 1000;

  const vp = window.innerWidth;
  const len = firstName.length;
  const scale = Math.max(
    Math.min((vp * (scMa - scMi)) / (vpMa - vpMi), scMa),
    scMi
  );
  const fontSizeBase = ((len - numMi) / (numMa - numMi)) * (fsMi - fsMa) + fsMa;
  const fontSize = Math.max(Math.min(fontSizeBase, fsMa), fsMi) * scale;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <Input
        styles={(theme) => ({
          wrapper: {
            display: "inline",
          },
          input: {
            color: theme.colors.leetGreen[6],
            fontSize: fontSize + "rem",
            height: "2em",
            border: "none",
            width: len * 1.4 + "ch",
            background: "transparent",
            textAlign: "center",
            letterSpacing: "0.4ch",
            marginRight: "-0.4ch",
            padding: "0",
          },
        })}
        ref={letterInput}
        defaultValue={input}
        onChange={onChange}
      />

      <Box
        sx={(theme) => ({
          color: endReached ? theme.colors.leetGreen[6] : "transparent",
          display: "inline-block",
          fontSize: fontSize + "rem",
          width: "0",
          lineHeight: "2.5em",
        })}
      >
        ↵
      </Box>
    </div>
  );
};
