import React from "react";

export enum FILTER_BY {
  NONE,
  NAME,
  CITY,
}

export const FilterContext = React.createContext({
  filterBy: FILTER_BY.NONE,
  setFilterBy: (val: FILTER_BY) => {},
  filterValue: '',
  setFilterValue: (val: string) => {},
});
