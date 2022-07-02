import {useContext, useMemo} from "react";
import {SORT_BY, SortContext} from "../contexts/SortContext/SortContext";
import {Coworker} from "../interfaces/CoworkerModel";

type Sorter = (a: Coworker, b:Coworker) => number;
const sortNameAZ: Sorter = ({name : nameA}, {name:nameB}) => {
  return nameA === nameB ? 0 : nameA > nameB ? 1 : -1;
}
const sortNameZA: Sorter = ({name : nameA}, {name:nameB}) => {
  return nameA === nameB ? 0 : nameA < nameB ? 1 : -1;
}
const sortCity: Sorter = ({office: officeA}, {office: officeB}) => {
  return officeA === officeB ? 0 : officeA > officeB ? 1 : -1;
}
export const useSort = (data:Coworker[] | undefined) => {
  const {sortBy} = useContext(SortContext);

  const sortedData = useMemo(() => {
    if(!data || sortBy === SORT_BY.NONE) return data;

    let sortFunction;
    switch(sortBy) {
      case SORT_BY.NAME_AZ:
        sortFunction = sortNameAZ
        break;
      case SORT_BY.NAME_ZA:
        sortFunction = sortNameZA
        break;
      case SORT_BY.CITY:
        sortFunction = sortCity
        break;
    }
    return  data.sort(sortFunction);

  }, [sortBy, data])

  return sortedData;
}
