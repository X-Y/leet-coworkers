import React from "react";

import {Coworker} from "../interfaces/CoworkerModel";

interface Props {
  coworkers: Coworker[]
}

const CoworkersList: React.FC<Props> = ({coworkers}) => {
  return (
    <ul>
      {
        coworkers.map(({name}, idx) => <li key={idx}>
          <span>{name}</span>
        </li>)
      }
    </ul>
  )
}
export default  CoworkersList;
