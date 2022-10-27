import React, { useEffect, useState } from "react";
import { Transition } from "@mantine/core";

import { Coworker as CoworkerModel } from "../../interfaces/CoworkerModel";

import Coworker from "../Coworker/Coworker";

import styles from "./CoworkersList.module.scss";

interface Props {
  coworkers: CoworkerModel[];
}

const slideUp = {
  in: { opacity: 1, transform: "translateY(0)" },
  out: { opacity: 0, transform: "translateY(20px)" },
  common: { transformOrigin: "top" },
  transitionProperty: "transform, opacity",
};

const CoworkersList: React.FC<Props> = ({ coworkers }) => {
  const [mounted, setMounted] = useState(-1);
  useEffect(() => {
    setMounted(0);
    return () => {
      setMounted(-1);
    };
  }, []);
  return (
    <ul className={styles.CoworkersList}>
      {coworkers.map((coworker, idx) => (
        <li key={idx}>
          <Transition
            mounted={mounted >= idx}
            transition={slideUp}
            duration={2000}
            timingFunction="cubic-bezier(0.230, 1.000, 0.320, 1.000)"
            onEnter={() => {
              setTimeout(() => {
                setMounted(idx + 1);
              }, 140);
            }}
          >
            {(styles) => (
              <div style={styles}>
                <Coworker {...coworker} />
              </div>
            )}
          </Transition>
        </li>
      ))}
    </ul>
  );
};
export default CoworkersList;
