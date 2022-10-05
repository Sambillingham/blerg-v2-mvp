
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


  // await blergs.connect(accounts[2]).mint()
  // await blergs.connect(accounts[2]).mint()


  // await blergs.onTraitTransfer(accounts[0].address, 1)
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
