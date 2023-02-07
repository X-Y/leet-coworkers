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
const ulVariantsLong = {
  open: {
    transition: { staggerChildren: 0.01 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const liVariants = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: 50,
    opacity: 0,
  },
};
const liVariantsLong = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: 10,
    opacity: 0,
  },
};

interface Props {
  coworkers: CoworkerModel[];
}
const CoworkersList: React.FC<Props> = ({ coworkers }) => {
  const isLong = coworkers.length > 30;
  return (
    <motion.ul
      className={styles.CoworkersList}
      variants={isLong ? ulVariantsLong : ulVariants}
    >
      {coworkers.map((coworker, idx) => (
        <motion.li key={idx} variants={isLong ? liVariantsLong : liVariants}>
          <Coworker {...coworker} />
        </motion.li>
      ))}
    </motion.ul>
  );
};
export default CoworkersList;
