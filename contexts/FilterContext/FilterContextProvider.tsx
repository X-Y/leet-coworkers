import {FilterContext, FILTER_BY} from './FilterContext'
import {FC, PropsWithChildren, useState} from "react";
const FilterContextProvider:FC<PropsWithChildren> = ({children}) => {
  const [filterBy, setFilterBy] = useState(FILTER_BY.NONE)
  const [filterValue, setFilterValue] = useState('')

  const value = {filterBy, setFilterBy, filterValue, setFilterValue}
  return <FilterContext.Provider value={value}>
    {children}
  </FilterContext.Provider>
}

export default FilterContextProvider;
