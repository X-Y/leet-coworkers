import { Radio } from "@mantine/core";

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
