import React, { ChangeEvent } from "react";
import { Select } from "@mantine/core";

interface Props {
  id: string;
  label: string;
  onChange: (e: string) => void;
  options: { [key: string]: string };
}

const Dropdown: React.FC<Props> = ({ id, label, onChange, options }) => {
  const data = Object.entries(options).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  return (
    <Select label={label} placeholder="" data={data} onChange={onChange} />
  );
};

export default Dropdown;
