import React from "react";

export enum SORT_BY {
  NONE,
  NAME_AZ,
  NAME_ZA,
  CITY,
}

export const SortContext = React.createContext({
  sortBy: SORT_BY.NONE,
  setSortBy: (val: SORT_BY) => {},
});
