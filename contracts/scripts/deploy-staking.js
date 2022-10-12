
const hre = require("hardhat");

async function main() {

  const accounts = await hre.ethers.getSigners();

  const TraitsFactory = await hre.ethers.getContractFactory("TraitsStaking");
  const traits = await TraitsFactory.deploy();

  await traits.deployed();

  console.log("Traits v:Staking -> deployed to:", traits.address);


  const BlergsFactory = await hre.ethers.getContractFactory("BlergsStaking");
  const blergs = await BlergsFactory.deploy();

  await blergs.deployed();
  await blergs.setTraitsAddress(traits.address)

  console.log("blergs v:Staking -> deployed to:", blergs.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
