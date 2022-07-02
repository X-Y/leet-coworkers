import React from "react";
import Image from 'next/image';

import {Coworker as CoworkerModel} from '../../interfaces/CoworkerModel';

import styles from './Coworker.module.scss';

interface Props extends CoworkerModel{

}
const Coworker: React.FC<Props> = ({name, office, imagePortraitUrl, linkedIn, gitHub, twitter}) => {
  return <article className={styles.Card}>
    <figure>
      <img src={imagePortraitUrl} />
    </figure>

    <div className={styles.InfoBox}>
      <div className={styles.Details}>
        <div className={styles.Name}>{name}</div>
        <div className={styles.Office}>Office: {office}</div>
      </div>
      <div className={styles.SocialMedia}>
        {
          !!linkedIn &&
          <a className={styles.LinkedIn} href={linkedIn}>
            <img src={'/linkedin.svg'} />
          </a>
        }
        {
          !!gitHub &&
          <a className={styles.Github} href={gitHub}>
            <img src={'/github.svg'} />
          </a>
        }
        {
          !!twitter &&
          <a className={styles.Twitter} href={twitter}>
            <img src={'/twitter.svg'} />
          </a>
        }



      </div>
    </div>


  </article>
}
export default Coworker;
