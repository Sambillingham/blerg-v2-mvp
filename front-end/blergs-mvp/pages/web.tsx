import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Navbar from '../components/navbar';

import { useAccount, usePrepareContractWrite, useContractWrite, useContractRead, usePrepareSendTransaction, useContractReads, useSignMessage } from 'wagmi';
import ContractInterfaceTraits from '../Traits.json';
import ContractInterfaceBlergs from '../BlergsWeb.json';

const { NEXT_PUBLIC_URL } = process.env;

const Home: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);

  const [totalMinted, setTotalMinted] = React.useState<number[]>([]);
  const [totalSupply, setTotalSupply] = React.useState<number>(0);
  const [selectedTraits, setSelectedTraits] = React.useState<number[]>([]);
  const [allImg, setAllImg] = React.useState<string[]>([]);
  
  
  const { address, isConnected } = useAccount();

  React.useEffect(() => setMounted(true), []);

  const traitsContract = {
    addressOrName: '0x816d9a9e7D384b5fa6F47e82b62cBFB051CBf71a',
    contractInterface : ContractInterfaceTraits.abi
  }

  const blergsContract = {
    addressOrName: '0x3C1fFa7FbFAbefA76528B8669bC9004ce569A708',
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
    functionName: 'mintBlank',
  });
  const { write: mintBlerg } = useContractWrite(configBlergs);


  const { data: balanceData } = useContractRead({
    ...traitsContract,
    functionName: 'balanceOfBatch',
    args: [ Array(10).fill(address), [0,1,2,3,4,5,6,7,8,9]],
    watch: true
  });

  const { data: contractSupply } = useContractRead({
    ...blergsContract,
    functionName: 'totalSupply',
    watch: true
  });
 

  const { data: signedMessage, error, isLoading, signMessage } = useSignMessage({
    async onSuccess(data, variables) {
      console.log(data);

      const response = await fetch(`${NEXT_PUBLIC_URL}/api/verify`, {
          method: 'POST',
          cache: 'no-cache',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            message: variables.message,
            address,
            signedMessage: data
          }) 
      })
      
      let newArr = [...allImg]; 

      const id = parseInt(variables.message.toString().split(':')[1])
      console.log('ID',  id,variables.message.toString(),  variables.message.toString().split(':'));

      newArr[id] = `/api/svg/${id}?${Date.now()}`
      setAllImg(newArr);


      const json = await response.json();
      console.log(json)
    },
  })


  const emitSwitchTraits = async (blergId: number) => {
    const content = [`Trait Switch// Blerg #${blergId} `, blergId, ...selectedTraits].join(':');

    signMessage({message: content})
  }
  const emitMintBlerg = async () => {
    console.log(selectedTraits)
      mintBlerg?.()
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/mint`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          traits: selectedTraits.join(''),
          blergId: totalSupply
        }) 
    })
    console.log(response)
  }

  const addSelectedTrait = (traitId: any) => {
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
  if (totalSupply) {
    setAllImg([...Array(totalSupply)].map( (x,i) => `/api/svg/${i}?${Date.now()}`))
  }
}, [totalSupply]);

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
        <Navbar/>
        <h2>Traits/Blergs Integration MVP</h2>

        <ConnectButton />

        <div className={styles.intro}>
        <p> <strong>Version: Web</strong> - Traits can be freely switched with a signed message</p>
          <ul>
          <li>Mint Pack of Traits - IDs #0-9</li>
          <li>Mint a blerg with Traits</li>
          <li>Switch Traits on existing Blerg -(sign a transaction) 0eth cost</li>
          <li>Letters A-E represent using a non-Trait NFT as part of a blerg </li>
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
            <h2>
            Total Supply {totalSupply}
            </h2>
            <div className={styles.blergContainer}>
            {[...Array(totalSupply)].map((x, i) =>
              <div className={styles.blergItem} key={i.toString()}>
                <img className={styles.blergSvg} src={allImg[totalSupply-i-1]}/>
                <div className={styles.blergDetails} >
                  <Link href={`/api/blerg/${totalSupply - i-1}`}>
                    <a> {NEXT_PUBLIC_URL}/api/blerg/{totalSupply - i-1}</a>
                  </Link>
                  <hr/>
                  <Link href={`https://testnets.opensea.io/assets/goerli/${blergsContract.addressOrName}/${totalSupply - i-1}`}>
                    <a>OpenSea</a>
                  </Link>
                </div>
                <button 
                  className={styles.button}
                  onClick={() => emitSwitchTraits?.(totalSupply - i-1)}
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
                {totalMinted.map((x, i) => {
                    if (x > 0) {
                    return (
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
                    </div>)}
                  }
                )}
              </div>
              <h1 className={styles.title}>
              Other NFT
              </h1>
                <div className={styles.traits}>
                  {['A','B','C','D','E'].map((x, i) => {
                      return (
                        <div key={i.toString()}>
                          <div className={styles.trait} >
                            #{x}
                          </div>
                          <button 
                            className={styles.button}
                            onClick={() => addSelectedTrait?.(x)}
                          >
                            add
                          </button>
                      </div>)
                    }
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
