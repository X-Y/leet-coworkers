import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {useQuery} from 'react-query';

import {Coworker} from "../interfaces/CoworkerModel";

import {coworkersApi} from "../lib/frontendApi";

import CoworkersList from '../components/CoworkersList/CoworkersList';

import styles from '../styles/Home.module.scss'
import {useState} from "react";
import ControlBar from "../containers/ControlBar/ControlBar";
import {useSort} from "../Hooks/useSort";

const Home: NextPage = () => {
  const [amount, setAmount] = useState(20);
  const { status, data, error, isFetching } = useQuery<Coworker[]>('getCoworkers', coworkersApi, {
    staleTime: 60000
  });

  const sortedData = useSort(data);

  const onLoadMoreClick= () => {
    setAmount(amount + 10);
  }

  return (
    <div className={styles.container}>
      <ControlBar />
      {!!sortedData &&
        <CoworkersList coworkers={sortedData?.slice(0, amount)} />
      }
      {!sortedData &&
        <div>Loading...</div>
      }

      <button className={styles.LoadMoreButton} onClick={onLoadMoreClick}>Load More</button>
    </div>
  )
}

export default Home
