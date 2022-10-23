import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {useQuery} from 'react-query';

import {Coworker} from "../interfaces/CoworkerModel";

import {coworkersApi, mockCoworkersApi} from "../lib/frontendApi";

import CoworkersList from '../components/CoworkersList/CoworkersList';

import styles from '../styles/Home.module.scss'
import {useState} from "react";
import ControlBar from "../containers/ControlBar/ControlBar";
import {useSort} from "../hooks/useSort";
import {useFilter} from "../hooks/useFilter";

const Home: NextPage = () => {
  const [amount, setAmount] = useState(20);
  const { status, data, error, isFetching } = useQuery<Coworker[]>('getCoworkers', mockCoworkersApi, {
    staleTime: 60000
  });

  let resData = data;
  resData = useFilter(resData);
  resData = useSort(resData);

  const onLoadMoreClick= () => {
    setAmount(amount + 10);
  }

  return (
    <div className={styles.container}>
      <ControlBar />
      {!!resData &&
        <CoworkersList coworkers={resData.slice(0, amount)} />
      }
      {!resData &&
        <div>Loading...</div>
      }

      {
        resData && amount < resData.length &&
        <button className={styles.LoadMoreButton} onClick={onLoadMoreClick}>Load More</button>
      }
    </div>
  )
}

export default Home
