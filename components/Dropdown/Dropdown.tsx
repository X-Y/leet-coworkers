import React, {ChangeEvent} from "react";

interface Props {
  id: string;
  label: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: {[key:string]: string}
}

const Dropdown:React.FC<Props> = ({id,label, onChange, options}) => {
  return <div>
    <label htmlFor={id}>{label}</label>
    <select id={id} onChange={onChange}>
      {Object.entries(options).map(([key, value]) =>
        <option value={key} key={key}>{value}</option>
      )}
    </select>
  </div>
}

export default Dropdown;
