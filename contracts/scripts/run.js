
const hre = require("hardhat");

async function main() {

  const accounts = await hre.ethers.getSigners();

  const TraitsFactory = await hre.ethers.getContractFactory("Traits");
  const traits = await TraitsFactory.deploy();

  await traits.deployed();

  console.log("Traits deployed to:", traits.address);


  const BlergsFactory = await hre.ethers.getContractFactory("Blergs");
  const blergs = await BlergsFactory.deploy();

  await blergs.deployed();
  await blergs.setTraitsAddress(traits.address)

  console.log("blergs deployed to:", blergs.address);

  const traits10 = [...Array(100).keys()];
  const array10 = Array(100).fill(1)

  await traits.connect(accounts[0]).mintBatch(traits10, array10)

  for (let i = 0; i < 100 ; i++) {
      let balance = await traits.balanceOf(accounts[0].address,i)
      console.log(`Balance ${accounts[0].address}: TokenId ${i} : Balance ${balance}`);
  }

  const buildBlerg = await blergs.mint();
  await buildBlerg.wait();   

  const buildBlerg2 = await blergs.mint();
  await buildBlerg2.wait();   

  const uri = await blergs.tokenURI(0);
  console.log('URI: ', uri)

  // await blergs.setTraits(0, [86,22,11,03,04])

  const mintWithTraits = await blergs.mintWithTraits([11,1,2,3,35]);
  await mintWithTraits.wait();   

  const uri2 = await blergs.tokenURI(1);
  console.log('URI: ', uri2)


  await blergs.connect(accounts[2]).mint()
  await blergs.connect(accounts[2]).mint()


  await blergs.onTraitTransfer(accounts[0].address, 1)
  // const bal = await blergs.balanceOf(accounts[0].address)
  // console.log('balance ->', bal);
  // const bal2 = await blergs.balanceOf(accounts[2].address)
  // console.log('balance ->', bal2);
  // const a = await blergs.tokenOfOwnerByIndex(accounts[0].address, 0);
  // const b = await blergs.tokenOfOwnerByIndex(accounts[0].address, 1);
  // const c = await blergs.tokenOfOwnerByIndex(accounts[2].address, 1);
  // // const d = await blergs.tokenOfOwnerByIndex(accounts[0].address, 3);
  // console.log('token id ', a)
  // console.log('token id ', b)
  // console.log('token id ', c)
  // console.log('token id ', d)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
