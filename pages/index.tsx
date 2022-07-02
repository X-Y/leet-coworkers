import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {useQuery} from 'react-query';

import {Coworker} from "../interfaces/CoworkerModel";

import {coworkersApi} from "../lib/frontendApi";

import CoworkersList from '../components/CoworkersList/CoworkersList';

import styles from '../styles/Home.module.scss'
import {useState} from "react";

const Home: NextPage = () => {
  const [amount, setAmount] = useState(20);
  const { status, data, error, isFetching } = useQuery<Coworker[]>('getCoworkers', coworkersApi, {
    staleTime: 60000
  });

  const onLoadMoreClick= () => {
    setAmount(amount + 10);
  }

  return (
    <div className={styles.container}>
      {!!data &&
        <CoworkersList coworkers={data.slice(0, amount)} />
      }
      {!data &&
        <div>Loading...</div>
      }

      <button className={styles.LoadMoreButton} onClick={onLoadMoreClick}>Load More</button>
    </div>
  )
}

export default Home
