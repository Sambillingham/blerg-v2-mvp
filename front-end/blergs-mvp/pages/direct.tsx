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
  const [mounted, setMounted] = React.useState(false);

  const [totalMinted, setTotalMinted] = React.useState<number[]>([]);
  const [totalBlergs, setTotalBlergs] = React.useState<number>(0);
  const [totalSupply, setTotalSupply] = React.useState<number>(0);
  const [allURIs, setAllURIs] = React.useState<any[]>([])
  const [allOwners, setAllOwners] = React.useState<any[]>([])
  const [selectedTraits, setSelectedTraits] = React.useState<number[]>([]);
  const [sendId, setSendId] = React.useState<number>(0);
  
  const { address, isConnected } = useAccount();

  React.useEffect(() => setMounted(true), []);

  const traitsContract = {
    addressOrName: '0x4F449148AD107Ea76b888216Bf4fCAaba62D86d7',
    contractInterface : ContractInterfaceTraits.abi
  }

  const blergsContract = {
    addressOrName: '0x4f4899E99464Ee29d8f4e925C68e570c6EE945Ea',
    contractInterface : ContractInterfaceBlergs.abi
  }

  const {config: configTraits} = usePrepareContractWrite({
    ...traitsContract,
    functionName: 'mintBatch',
    args: [[0,1,2,3,4,5,6,7,8,9], Array(10).fill(1)]
  });
  const {write: mintBatch } = useContractWrite(configTraits);

  const { config: configBlergs } = usePrepareContractWrite({
    ...blergsContract,
    functionName: 'mintWithTraits',
    args: [selectedTraits]
  });
  const { write: mintBlerg } = useContractWrite(configBlergs);

  const { config: configBlergSwitch } = usePrepareContractWrite({
    ...blergsContract,
    functionName: 'setTraits',
    args: [sendId, selectedTraits]
  });
  const { write: switchTraits } = useContractWrite(configBlergSwitch);

  const { config: sendTraitConfig } = usePrepareContractWrite({
    ...traitsContract,
    functionName: 'safeTransferFrom',
    args: [address, '0x4Ead8bf030fd5575Fe978A5040ed82434e059691', sendId, 1, '0x']
  });
  const { write: sendTrait } = useContractWrite(sendTraitConfig)

  const { config: sendBlergConfig } = usePrepareContractWrite({
    ...blergsContract,
    functionName: 'transferFrom',
    args: [address, '0x4Ead8bf030fd5575Fe978A5040ed82434e059691', sendId ]
  });
  const { write: sendBlerg } = useContractWrite(sendBlergConfig)

  const { data: balanceData } = useContractRead({
    ...traitsContract,
    functionName: 'balanceOfBatch',
    args: [ Array(10).fill(address), [0,1,2,3,4,5,6,7,8,9]],
    watch: true
  });

  const { data: blergBal } = useContractRead({
    ...blergsContract,
    functionName: 'balanceOf',
    args: [address],
    watch: true
  });

  const { data: contractSupply } = useContractRead({
    ...blergsContract,
    functionName: 'totalSupply',
    watch: true
  });
 
  const emitSendTrait = (traitId: number) => {
    setSendId(traitId);
    console.log(traitId, sendId)
    sendTrait?.();
  }

  const emitSendBlerg = (traitId: number) => {
    setSendId(traitId);
    console.log(traitId, sendId)
    sendBlerg?.();
  }

  const emitSwitchTraits = (traitId: number) => {
    setSendId(traitId);
    switchTraits?.();
  }

  const addSelectedTrait = (traitId: number) => {
    const t = selectedTraits
    t.push(traitId)
    if(t.length > 5){
      t.shift()
    }
    console.log(t)
    setSelectedTraits([...t])
  }

  React.useEffect(() => {
    if (balanceData) {
      const contents = balanceData.map(x => x.toNumber())
      setTotalMinted(contents);
    }
  }, [balanceData]);


  React.useEffect(() => {
    if (blergBal) {
      setTotalBlergs(blergBal.toNumber());
    }
  }, [blergBal]);


  React.useEffect( () => {
    if (contractSupply) {
      setTotalSupply(contractSupply.toNumber());
      console.log('supply - ', contractSupply)
    }
  }, [contractSupply]);
  

  const { data: allBlergsUri  } = useContractReads({
    contracts: [
      ...[...Array(totalSupply)].map( (x, i) => {
        return {
          ...blergsContract,
          functionName: 'tokenURI',
          args: [i]
      }})
    ],
    watch: true,
  })

  React.useEffect( () => {
    if (allBlergsUri) setAllURIs(allBlergsUri)
  }, [allBlergsUri]);



  const { data: allOwnersAddress  } = useContractReads({
    contracts: [
      ...[...Array(totalSupply)].map( (x, i) => {
        return {
          ...blergsContract,
          functionName: 'ownerOf',
          args: [i]
      }})
    ],
    watch: true,
  })

  React.useEffect( () => {
    if (allOwnersAddress) setAllOwners(allOwnersAddress)
  }, [allOwnersAddress]);

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

      <nav>
          <Link href="/web">web</Link>
          <br/>
          <Link href="/staking">staking</Link>
          <br/>
          <Link className={styles.link} href="/direct">direct</Link>
        </nav>

        <h2>Traits/Blergs Integration MVP</h2>

        <ConnectButton />

      <div className={styles.intro}>
        
        <p> <strong>Version: Integrated Callback</strong> - Allows other smart contracts to initiate a function call when traits are transfered. This allows projects to take action when traits move between wallets e.g - Start/stop rewards without further user Interaction</p>
        <p>Any project can integrate by calling registerAddress(args) and implementing an onTraitTransfer(args) method and use that data as needed</p>
          <ul>
          <li>Mint Pack of Traits - IDs #0-9</li>
          <li>Select 5 Traits to Mint A Blerg </li>
          <li>Switch traits on existing Blerg</li>
          <li><strong>Traits can only be used if owned</strong></li>
          <li>Transfering away traits in use by a blerg to a balance of zero will reset the blergs data to default (0000)</li>
          <li>Transfering Blerg  will reset the blergs data to default (0000) </li>
          </ul>
      </div>

      <div className={styles.split}>
        <section>
          <div>
          <h1 className={styles.title}>
              Mint A Blerg
          </h1>
            { mounted && isConnected && (
            <div className={styles.buildBlerg}>
              <div
              className={styles.blergTraits}>
                  {selectedTraits.map((x, i) =>
                    <div  key={i.toString()} className={styles.trait} >
                      #{x}
                    </div>
                )}
                </div>

              <button 
                className={styles.button}
                onClick={() => mintBlerg?.()} >
                Build Blerg
              </button>
            </div>
          )}
          <div>
            wallet - {totalBlergs} - Total Supply {totalSupply}
          </div>
          <div>
          {[...Array(totalSupply)].map((x, i) =>
            <div key={i.toString()}>
              <div className={styles.blerg} >
                #{allURIs[i]}
                <p>owner : {(allOwners[i])?.substring(0,5)}</p>
              </div>
              <button 
                className={styles.button}
                onClick={() => emitSwitchTraits?.(i)}
              >
                switch Traits
              </button>
              <button 
                className={styles.button}
                onClick={() => emitSendBlerg?.(i)}
              >
                Send Blerg
              </button>
            
            </div>
          )}
          </div>
          </div>
          
        </section>

        <section>
          <div>
            <h1 className={styles.title}>
              Mint A Trait Pack
            </h1>
            { mounted && isConnected && (
            <div>
              <button 
                className={styles.button}
                onClick={() => mintBatch?.()} >
                Mint Pack (10)
              </button>
            <h1 className={styles.title}>
              Wallet
            </h1>
              <div className={styles.traits}>
                {totalMinted.map((x, i) =>
                  <div key={i.toString()}>
                    <div className={styles.trait} >
                      #{i}
                      <p>{x}</p>
                    </div>
                    <button 
                      className={styles.button}
                      onClick={() => addSelectedTrait?.(i)}
                    >
                      add
                    </button>
                  
                    <button 
                      className={styles.button}
                      onClick={() => emitSendTrait?.(i)}
                    >
                      Send
                    </button>
                  
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </section> 
      </div>
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
