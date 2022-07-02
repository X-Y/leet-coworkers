import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {useQuery} from 'react-query';

import {Coworker} from "../interfaces/CoworkerModel";

import {coworkersApi} from "../lib/frontendApi";

import CoworkersList from '../components/CoworkersList/CoworkersList';

import styles from '../styles/Home.module.css'

const Home: NextPage = () => {

  const { status, data, error, isFetching } = useQuery<Coworker[]>('getCoworkers', coworkersApi, {
    staleTime: 60000
  });

  let coworkersList;
  if(data) {
    coworkersList = <CoworkersList coworkers={data.slice(0, 10)} />
  }

  return (
    <div className={styles.container}>
      {coworkersList}
    </div>
  )
}

export default Home
