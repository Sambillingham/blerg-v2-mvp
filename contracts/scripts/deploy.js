
const hre = require("hardhat");

async function main() {

  const accounts = await hre.ethers.getSigners();

  const TraitsFactory = await hre.ethers.getContractFactory("Traits");
  const traits = await TraitsFactory.deploy();

  await traits.deployed();

  console.log("Traits -> deployed to:", traits.address);


  const BlergsFactory = await hre.ethers.getContractFactory("Blergs");
  const blergs = await BlergsFactory.deploy();

  await blergs.deployed();
  await blergs.setTraitsAddress(traits.address)

  console.log("blergs -> deployed to:", blergs.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
