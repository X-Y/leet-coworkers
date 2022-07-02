import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {Coworker} from "../interfaces/CoworkerModel";
import {FILTER_BY, FilterContext} from "../contexts/FilterContext/FilterContext";

const filterByKeyMap = {
  [FILTER_BY.CITY]: 'office',
  [FILTER_BY.NAME]: 'name',
}
function* generateData (data: Coworker[], filterBy: 'office' | 'name', filterValue: string) {
  const regex = new RegExp(filterValue, 'i');
  for(const one of data) {
    if(one[filterBy] && one[filterBy].search(regex) !== -1) {
      yield one;
    }
  }
}

export const useFilter = (data:Coworker[] | undefined, amount: number) => {
  const {filterBy, filterValue} = useContext(FilterContext);

  const getOutput = (_output: Coworker[], gen: ReturnType<typeof generateData>) => {
    if (_output.length < amount) {
      const diff = amount - _output.length;

      const newOutput = [..._output];
      for (let i = 0; i < diff; i++) {
        const newItem = gen.next();
        if(newItem.done) break;
        newOutput.push(newItem.value);
      }

      return newOutput;
    }
    return _output;
  };

  const filterByKey = filterBy === FILTER_BY.CITY ? 'office' : filterBy === FILTER_BY.NAME
  ? 'name' : '';

  if(!data || filterByKey === '' || filterValue === '') return data;

  const gen = generateData(data, filterByKey, filterValue)

  return getOutput([], gen);
}
