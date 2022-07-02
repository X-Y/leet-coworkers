import React from "react";

import {Coworker as CoworkerModel} from "../../interfaces/CoworkerModel";

import Coworker from "../Coworker/Coworker";

import styles from './CoworkersList.module.scss';

interface Props {
  coworkers: CoworkerModel[]
}

const CoworkersList: React.FC<Props> = ({coworkers}) => {
  return (
    <ul className={styles.CoworkersList}>
      {
        coworkers.map((coworker, idx) => <li key={idx}>
          <Coworker {...coworker} />
        </li>)
      }
    </ul>
  )
}
export default  CoworkersList;
