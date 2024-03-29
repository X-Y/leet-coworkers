import React, { ChangeEvent, useContext } from "react";
import { SortContext, SORT_BY } from "../../contexts/SortContext/SortContext";
import Dropdown from "../../components/Dropdown/Dropdown";

const options = {
  [SORT_BY.NONE]: "none",
  [SORT_BY.NAME_AZ]: "name A-Z",
  [SORT_BY.NAME_ZA]: "name Z-A",
  [SORT_BY.CITY]: "city",
};
const Sort: React.FC = () => {
  const { setSortBy } = useContext(SortContext);
  const id = "control-sortby";
  const onSortChange = (value: string) => {
    setSortBy(+value);
  };
  return (
    <Dropdown
      id={id}
      label={"Sort By"}
      onChange={onSortChange}
      options={options}
    />
  );
};

export default Sort;
