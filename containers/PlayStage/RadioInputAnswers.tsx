import { Radio } from "@mantine/core";
import { useEffect, useState } from "react";
import FlagText from "../../components/FlagText/FlagText";

interface RadioInputAnswersProps {
  onChange: (value: string) => void;
  options: string[];
}
export const RadioInputAnswers = ({
  onChange,
  options,
}: RadioInputAnswersProps) => {
  return (
    <Radio.Group
      orientation="vertical"
      name="quiz"
      onChange={onChange}
      sx={(theme) => ({
        flexGrow: 1,
        label: { fontSize: "30px" },
      })}
    >
      {options.map((option, idx) => (
        <Radio
          key={"radio-option-" + idx}
          value={option}
          label={option}
          styles={(theme) => ({
            label: {
              color: theme.colors.leetPurple[0],
            },
          })}
        />
      ))}
    </Radio.Group>
  );
};

export const RadioInputAnswersWithReveal = (props: RadioInputAnswersProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const reveal = () => {
    setIsRevealed(true);
    window.removeEventListener("click", reveal);
  };

  useEffect(() => {
    window.addEventListener("click", reveal);
    return () => {
      window.removeEventListener("click", reveal);
    };
  }, []);

  if (!isRevealed) {
    return <FlagText>Ready?</FlagText>;
  }

  return <RadioInputAnswers {...props} />;
};
