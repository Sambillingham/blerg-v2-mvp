import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { useAccount, usePrepareContractWrite, useContractWrite, useContractRead, usePrepareSendTransaction, useContractReads } from 'wagmi';
import ContractInterfaceTraits from '../Traits.json';
import ContractInterfaceBlergs from '../Blergs.json';


const Home: NextPage = () => {
 


 
  return (
    <div className={styles.container}>
      <Head>
        <title>BLERGS App</title>
        <meta
          name="blergs mvp"
          content="Made by SB with // @rainbow-me/create-rainbowkit"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h2>Traits/Blergs Integration MVP</h2>
        <nav>
          <Link href="/web">web</Link>
          <br/>
          <Link href="/staking">staking</Link>
          <br/>
          <Link className={styles.link} href="/direct">direct</Link>
        </nav>

      </main>

      <footer className={styles.footer}>
        <a target="_blank" rel="noopener noreferrer">
          Build A Blerg MVP 2022
        </a>
      </footer>
    </div>
  );
};

export default Home;
