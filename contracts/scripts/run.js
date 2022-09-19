
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

  const uri = await blergs.tokenURI(0);
  console.log('URI: ', uri)

  await blergs.setTraits(0, [86,22,11,03,04])

  const mintWithTraits = await blergs.mintWithTraits([11,01,02,03,35]);
  await mintWithTraits.wait();   

  const uri2 = await blergs.tokenURI(1);
  console.log('URI: ', uri2)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
