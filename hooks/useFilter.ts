import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Coworker } from "../interfaces/CoworkerModel";
import {
  FILTER_BY,
  FilterContext,
} from "../contexts/FilterContext/FilterContext";

const filterByKeyMap = {
  [FILTER_BY.CITY]: "office",
  [FILTER_BY.NAME]: "name",
};

export const filterData = (
  data: Coworker[] | undefined,
  filterBy: FILTER_BY,
  filterValue: string
) => {
  const filterByKey =
    filterBy === FILTER_BY.CITY
      ? "office"
      : filterBy === FILTER_BY.NAME
      ? "name"
      : "";

  if (!data || filterByKey === "" || filterValue === "") return data;

  const regex = new RegExp(filterValue, "i");
  const filteredData = data.filter(
    (one) => one[filterByKey] && one[filterByKey].search(regex) !== -1
  );

  return filteredData;
};

export const useFilter = (data: Coworker[] | undefined) => {
  const { filterBy, filterValue } = useContext(FilterContext);

  return filterData(data, filterBy, filterValue);
};
