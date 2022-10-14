import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { useAccount, usePrepareContractWrite, useContractWrite, useContractRead, usePrepareSendTransaction, useContractReads, useSignMessage } from 'wagmi';
import ContractInterfaceTraits from '../Traits.json';
import ContractInterfaceBlergs from '../Blergs.json';

const Home: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);

  const [totalMinted, setTotalMinted] = React.useState<number[]>([]);
  const [totalSupply, setTotalSupply] = React.useState<number>(0);
  const [allOwners, setAllOwners] = React.useState<any[]>([])
  const [selectedTraits, setSelectedTraits] = React.useState<number[]>([]);
  
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
 

  const { data: signedMessage, error, isLoading, signMessage } = useSignMessage({
    async onSuccess(data, variables) {
      console.log(signedMessage);

      const response = await fetch('http://dancing-capybara-b2f749.netlify.app/.netlify/functions/verify', {
          method: 'POST',
          cache: 'no-cache',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            message: variables.message,
            address,
            signedMessage: data
          }) 
      })
      const json = await response.json();
    },
  })


  const emitSwitchTraits = async (blergId: number) => {
    const content = [`Trait Switch// Blerg #${blergId} `, blergId, ...selectedTraits].join(':');

    signMessage({message: content})
  }
  const emitMintBlerg = async () => {
      mintBlerg?.()
      const response = await fetch('http://dancing-capybara-b2f749.netlify.app/.netlify/functions/mint', {
        method: 'POST',
        cache: 'no-cache',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          traits: selectedTraits,
          blergId: totalSupply
        }) 
    })
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


  React.useEffect( () => {
    if (contractSupply) {
      setTotalSupply(contractSupply.toNumber());
      console.log('supply - ', contractSupply)
    }
  }, [contractSupply]);

  React.useEffect( () => {
    
  }, []);



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
        
        <p> <strong>Version: Web</strong> - Traits can be freely switched with a signed message</p>
          <ul>
          <li>Mint Pack of Traits - IDs #0-9</li>
          <li>Select Traits you own to use to Mint</li>
          <li>Switch Traits on existing Blerg - Freely</li>
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
                onClick={() => emitMintBlerg?.()} >
                Build Blerg
              </button>
            </div>
          )}
          <div>
           Total Supply {totalSupply}
          </div>
          <div>
          {[...Array(totalSupply)].map((x, i) =>
            <div key={i.toString()}>
              <div className={styles.blerg} >
                <Link href={`/api/${i}`}><a> URI: //api/${i}</a></Link>
                <p>owner : {(allOwners[i])?.substring(0,5)}</p>
              </div>
              <button 
                className={styles.button}
                onClick={() => emitSwitchTraits?.(i)}
              >
                switch Traits
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
              Traits
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
