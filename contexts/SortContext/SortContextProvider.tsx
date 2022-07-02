import {SortContext, SORT_BY} from './SortContext'
import {FC, PropsWithChildren, useState} from "react";
const SortContextProvider:FC<PropsWithChildren> = ({children}) => {
  const [sortBy, setSortBy] = useState(SORT_BY.NONE)
  const value = {sortBy, setSortBy}
  return <SortContext.Provider value={value}>
    {children}
  </SortContext.Provider>
}

export default SortContextProvider;
