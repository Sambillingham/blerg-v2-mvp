
const hre = require("hardhat");

async function main() {

  const accounts = await hre.ethers.getSigners();

  const BlergsFactory = await hre.ethers.getContractFactory("BlergsWeb");
  const blergs = await BlergsFactory.deploy();

  await blergs.deployed();

  console.log("blergs -> deployed to:", blergs.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
