import React, {PropsWithChildren} from "react";
import styles from './ControlBarContainer.module.scss';

const ControlBarContainer:React.FC<PropsWithChildren> = ({children}) => {
  return <div className={styles.ControlBarContainer}>
    {children}
  </div>
}

export default ControlBarContainer;
