import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useQuery } from "react-query";

import { Coworker } from "../interfaces/CoworkerModel";

import { coworkersApi } from "../lib/frontendApi";

import CoworkersList from "../components/CoworkersList/CoworkersList";

import styles from "../styles/Home.module.scss";
import { useContext, useState } from "react";
import ControlBar from "../containers/ControlBar/ControlBar";
import { useSort } from "../hooks/useSort";
import { useFilter } from "../hooks/useFilter";
import { GlobalStoreContext } from "../contexts/GlobalStoreContext/GlobalStoreContext";
import { GoogleIdentity } from "../components/GoogleIdentity/GoogleIdentity";

const Home: NextPage = () => {
  const { oAuthCredential } = useContext(GlobalStoreContext);
  const [amount, setAmount] = useState(20);
  const { status, data, error, isFetching, remove } = useQuery<Coworker[]>(
    "getCoworkers",
    coworkersApi,
    {
      staleTime: 60000,
      enabled: !!oAuthCredential,
    }
  );

  if (!oAuthCredential) {
    remove();
  }

  let resData = data;
  resData = useFilter(resData);
  resData = useSort(resData);

  const onLoadMoreClick = () => {
    setAmount(amount + 10);
  };

  return (
    <div className={styles.container}>
      <GoogleIdentity />

      <ControlBar />
      {!!resData && <CoworkersList coworkers={resData.slice(0, amount)} />}
      {!resData && <div>Loading...</div>}

      {resData && amount < resData.length && (
        <button className={styles.LoadMoreButton} onClick={onLoadMoreClick}>
          Load More
        </button>
      )}
    </div>
  );
};

export default Home;
