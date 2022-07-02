import React, {ChangeEvent} from "react";

interface Props {
  id: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: {[key:string]: string}
}

const Dropdown:React.FC<Props> = ({id, onChange, options}) => {
  return <div>
    <label htmlFor={id}>Sort By</label>
    <select id={id} onChange={onChange}>
      {Object.entries(options).map(([key, value]) =>
        <option value={key} key={key}>{value}</option>
      )}
    </select>
  </div>
}

export default Dropdown;
