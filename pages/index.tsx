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
import {useSort} from "../hooks/useSort";
import {useFilter} from "../hooks/useFilter";

const Home: NextPage = () => {
  const [amount, setAmount] = useState(20);
  const { status, data, error, isFetching } = useQuery<Coworker[]>('getCoworkers', coworkersApi, {
    staleTime: 60000
  });

  const sortedData = useSort(data);
  const filteredData = useFilter(sortedData, amount);

  const onLoadMoreClick= () => {
    setAmount(amount + 10);
  }

  return (
    <div className={styles.container}>
      <ControlBar />
      {!!filteredData &&
        <CoworkersList coworkers={filteredData?.slice(0, amount)} />
      }
      {!filteredData &&
        <div>Loading...</div>
      }

      <button className={styles.LoadMoreButton} onClick={onLoadMoreClick}>Load More</button>
    </div>
  )
}

export default Home
