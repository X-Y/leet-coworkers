import React, {ChangeEvent, useContext} from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import {FILTER_BY, FilterContext} from "../../contexts/FilterContext/FilterContext";

const filterByOptionsDefault = {
  [FILTER_BY.NONE]: 'none',
  [FILTER_BY.NAME]: 'name',
  [FILTER_BY.CITY]: 'city',
}

const citiesDefault = [ 'Borlänge','Helsingborg','Ljubljana','Lund', 'Stockholm' ]

interface Props {
  filterByOptions?: {
    [key: string]: string;
  },
  cities?: Array<string>
}

const Filter:React.FC<Props> = ({filterByOptions = filterByOptionsDefault, cities = citiesDefault}) => {
  const { filterBy, setFilterBy, setFilterValue} = useContext(FilterContext);
  const onFilterByChange = (e:ChangeEvent<HTMLSelectElement>) => {
    setFilterBy(+e.target.value);
    setFilterValue('');

  }
  const onChooseCityChange = (e:ChangeEvent<HTMLSelectElement>) => {
    setFilterValue(e.target.value);
  }
  const onNameChange = (e:ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  }

  const cityOptions = { ['']: 'none', ...Object.fromEntries(cities.map(one => [one, one]))}
  return <>
    <Dropdown id='control-filter-by' label='Filter By' onChange={onFilterByChange} options={filterByOptions} />
    {
      filterBy === FILTER_BY.CITY ?
        <Dropdown id='control-choose-city' label='Choose City' onChange={onChooseCityChange} options={cityOptions} />
      :filterBy === FILTER_BY.NAME ?
        <input id='control-filter-by-name' onChange={onNameChange} />
      : null
    }
  </>
}

export default Filter;
