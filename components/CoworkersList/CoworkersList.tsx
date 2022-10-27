import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Coworker as CoworkerModel } from "../../interfaces/CoworkerModel";

import Coworker from "../Coworker/Coworker";

import styles from "./CoworkersList.module.scss";

const ulVariants = {
  open: {
    transition: { staggerChildren: 0.07 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const liVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

interface Props {
  coworkers: CoworkerModel[];
}
const CoworkersList: React.FC<Props> = ({ coworkers }) => {
  return (
    <motion.ul className={styles.CoworkersList} variants={ulVariants}>
      {coworkers.map((coworker, idx) => (
        <motion.li key={idx} variants={liVariants}>
          <Coworker {...coworker} />
        </motion.li>
      ))}
    </motion.ul>
  );
};
export default CoworkersList;
