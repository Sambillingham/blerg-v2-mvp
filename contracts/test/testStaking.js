const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Blergs Staking", function () {

  it("Should mint 10 traits", async function () {

    const accounts = await hre.ethers.getSigners();

    const TraitsFactory = await hre.ethers.getContractFactory("TraitsStaking");
    const traits = await TraitsFactory.deploy();
  
    await traits.deployed();
    
    const traits10 = [...Array(10).keys()];
    const array10 = Array(10).fill(1)
  
    await traits.connect(accounts[0]).mintBatch(traits10, array10)
  });

  it("Should stake 1 trait", async function () {
    const accounts = await hre.ethers.getSigners();

    const TraitsFactory = await hre.ethers.getContractFactory("TraitsStaking");
    const traits = await TraitsFactory.deploy();
  
    await traits.deployed();
    
    const traits10 = [...Array(10).keys()];
    const array10 = Array(10).fill(1)
    await traits.connect(accounts[0]).mintBatch(traits10, array10)
    
    await traits.stake(0);
    const staked = await traits.staked(accounts[0].address, 0)
    expect(staked).to.equal(true);
  });

  it("Should unstake 1 traits", async function () {
    const accounts = await hre.ethers.getSigners();

    const TraitsFactory = await hre.ethers.getContractFactory("TraitsStaking");
    const traits = await TraitsFactory.deploy();
  
    await traits.deployed();
    
    const traits10 = [...Array(10).keys()];
    const array10 = Array(10).fill(1)
    await traits.connect(accounts[0]).mintBatch(traits10, array10)
    
    await traits.stake(0);
    const staked = await traits.staked(accounts[0].address, 0)
    expect(staked).to.equal(true);

    await traits.unstake(0);
    const stillstaked = await traits.staked(accounts[0].address, 0)
    expect(stillstaked).to.equal(false);
  });

  it("Should fail to transfer a staked Trait", async function () {

    const accounts = await hre.ethers.getSigners();

    const TraitsFactory = await hre.ethers.getContractFactory("TraitsStaking");
    const traits = await TraitsFactory.deploy();
    await traits.deployed();
  

    const traits10 = [...Array(10).keys()];
    const array10 = Array(10).fill(1)
    await traits.connect(accounts[0]).mintBatch(traits10, array10)

    await traits.stake(3);
    traits.safeTransferFrom(accounts[0].address, accounts[1].address, 3, 1, '0x')
    let balance = await traits.balanceOf(accounts[0].address,3)
    expect(balance).to.equal(1);
  });

  it("Should transfer a  Trait", async function () {

    const accounts = await hre.ethers.getSigners();

    const TraitsFactory = await hre.ethers.getContractFactory("TraitsStaking");
    const traits = await TraitsFactory.deploy();
    await traits.deployed();
  

    const traits10 = [...Array(10).keys()];
    const array10 = Array(10).fill(1)
    await traits.connect(accounts[0]).mintBatch(traits10, array10)

    traits.safeTransferFrom(accounts[0].address, accounts[1].address, 3, 1, '0x')
    let balance = await traits.balanceOf(accounts[0].address,3)
    expect(balance).to.equal(0);
  });



  it("Should switch 3 Traits from staked", async function () {
    const accounts = await hre.ethers.getSigners();

    const TraitsFactory = await hre.ethers.getContractFactory("TraitsStaking");
    const traits = await TraitsFactory.deploy();
  
    await traits.deployed();
    
    const traits10 = [...Array(10).keys()];
    const array10 = Array(10).fill(1)
    await traits.connect(accounts[0]).mintBatch(traits10, array10)
    
    await traits.stake(0);
    await traits.stake(1);
    await traits.stake(2);
    await traits.stake(3);
    await traits.stake(4);
    await traits.stake(5);
    await traits.stake(6);
    await traits.stake(7);

    const BlergsFactory = await hre.ethers.getContractFactory("BlergsStaking");
    const blergs = await BlergsFactory.deploy();
  
    await blergs.deployed();
    await blergs.setTraitsAddress(traits.address)

    const traitsparam = [0,1,2,3,4];
    const mintWithTraits = await blergs.mintWithTraits(traitsparam);
    await mintWithTraits.wait(); 
    const uri = await blergs.tokenURI(0);
    console.log(uri)
    expect(uri).to.equal(`uri://${traitsparam[0]}_${traitsparam[1]}_${traitsparam[2]}_${traitsparam[3]}_${traitsparam[4]}_`);

    const newtraits = [4,5,6,7,0];
    const uBlerg = await blergs.setTraits(0,newtraits);
    await uBlerg.wait(); 
    const newuri = await blergs.tokenURI(0);
    expect(newuri).to.equal(`uri://${newtraits[0]}_${newtraits[1]}_${newtraits[2]}_${newtraits[3]}_${newtraits[4]}_`);

  });


  it("Should mint a blerg with 3 Traits from staked", async function () {
    const accounts = await hre.ethers.getSigners();

    const TraitsFactory = await hre.ethers.getContractFactory("TraitsStaking");
    const traits = await TraitsFactory.deploy();
  
    await traits.deployed();
    
    const traits10 = [...Array(10).keys()];
    const array10 = Array(10).fill(1)
    await traits.connect(accounts[0]).mintBatch(traits10, array10)
    
    await traits.stake(0);
    await traits.stake(1);
    await traits.stake(2);
    await traits.stake(3);
    await traits.stake(4);

    const BlergsFactory = await hre.ethers.getContractFactory("BlergsStaking");
    const blergs = await BlergsFactory.deploy();
  
    await blergs.deployed();
    await blergs.setTraitsAddress(traits.address)
  

    const traitsparam = [0,1,2,3,4];
    const mintWithTraits = await blergs.mintWithTraits(traitsparam);
    await mintWithTraits.wait(); 
    const uri = await blergs.tokenURI(0);
    console.log(uri)
    expect(uri).to.equal(`uri://${traitsparam[0]}_${traitsparam[1]}_${traitsparam[2]}_${traitsparam[3]}_${traitsparam[4]}_`);

  });


  it("Unstaking used traits should return blank uri URI ", async function () {

    const accounts = await hre.ethers.getSigners();

    const TraitsFactory = await hre.ethers.getContractFactory("TraitsStaking");
    const traits = await TraitsFactory.deploy();
  
    await traits.deployed();
    
    const traits10 = [...Array(10).keys()];
    const array10 = Array(10).fill(1)
    await traits.connect(accounts[0]).mintBatch(traits10, array10)
    
    await traits.stake(0);
    await traits.stake(1);
    await traits.stake(2);
    await traits.stake(3);
    await traits.stake(4);

    const BlergsFactory = await hre.ethers.getContractFactory("BlergsStaking");
    const blergs = await BlergsFactory.deploy();
  
    await blergs.deployed();
    await blergs.setTraitsAddress(traits.address)
  

    const traitsparam = [0,1,2,3,4];
    const mintWithTraits = await blergs.mintWithTraits(traitsparam);
    await mintWithTraits.wait(); 
    const uri = await blergs.tokenURI(0);
    console.log(uri)
    expect(uri).to.equal(`uri://${traitsparam[0]}_${traitsparam[1]}_${traitsparam[2]}_${traitsparam[3]}_${traitsparam[4]}_`);
    
    await traits.unstake(0);
    const stillstaked = await traits.staked(accounts[0].address, 0)
    expect(stillstaked).to.equal(false);
    const newuri = await blergs.tokenURI(0);
    console.log(newuri)
    expect(newuri).to.equal('uri://0000');

  });

});
