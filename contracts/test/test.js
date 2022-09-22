const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Blergs", function () {
  it("Should return uri with 0000 for a new blank blergs", async function () {
    const BlergsFactory = await hre.ethers.getContractFactory("Blergs");
    const blergs = await BlergsFactory.deploy();
  
    await blergs.deployed();

    const buildBlerg = await blergs.mint();
    await buildBlerg.wait();   
  
    const uri = await blergs.tokenURI(0);
    expect(uri).to.equal("uri://0000");
  });

  it("Should return uri with relevant traits", async function () {

    const accounts = await hre.ethers.getSigners();

    const TraitsFactory = await hre.ethers.getContractFactory("Traits");
    const traits = await TraitsFactory.deploy();
  
    await traits.deployed();
  
    const BlergsFactory = await hre.ethers.getContractFactory("Blergs");
    const blergs = await BlergsFactory.deploy();
  
    await blergs.deployed();
    await blergs.setTraitsAddress(traits.address)
    await traits.setBlergsAddress(blergs.address)
  
    const traits10 = [...Array(100).keys()];
    const array10 = Array(100).fill(1)
  
    await traits.connect(accounts[0]).mintBatch(traits10, array10)

    const traitsparam = [86,22,11,03,04];
    const mintWithTraits = await blergs.mintWithTraits(traitsparam);
    await mintWithTraits.wait(); 
    const uri = await blergs.tokenURI(0);
    expect(uri).to.equal(`uri://${traitsparam[0]}_${traitsparam[1]}_${traitsparam[2]}_${traitsparam[3]}_${traitsparam[4]}_`);
  
      // await blergs.setTraits(0, traitsparam)
    // const uri2 = await blergs.tokenURI(1);
    // console.log('URI: ', uri2)
  });

  it("Should swap 5 traits", async function () {

    const accounts = await hre.ethers.getSigners();

    const TraitsFactory = await hre.ethers.getContractFactory("Traits");
    const traits = await TraitsFactory.deploy();
  
    await traits.deployed();
  
    const BlergsFactory = await hre.ethers.getContractFactory("Blergs");
    const blergs = await BlergsFactory.deploy();
  
    await blergs.deployed();
    await blergs.setTraitsAddress(traits.address)
    await traits.setBlergsAddress(blergs.address)

    const traits10 = [...Array(100).keys()];
    const array10 = Array(100).fill(1)
  
    await traits.connect(accounts[0]).mintBatch(traits10, array10)

    const traitsparam = [11,02,11,05,99];
    const buildBlerg = await blergs.mint();
    await buildBlerg.wait();   
    let uri = await blergs.tokenURI(0);
    expect(uri).to.equal(`uri://0000`);

    await blergs.setTraits(0, traitsparam)
    uri = await blergs.tokenURI(0);
    
    expect(uri).to.equal(`uri://${traitsparam[0]}_${traitsparam[1]}_${traitsparam[2]}_${traitsparam[3]}_${traitsparam[4]}_`);
  });

  it("Transfer Blergs (without Traits) - Should be a blank Blerg after Transfer ", async function () {

    const accounts = await hre.ethers.getSigners();

    const BlergsFactory = await hre.ethers.getContractFactory("Blergs");
    const blergs = await BlergsFactory.deploy();
  
    await blergs.deployed();

    const buildBlerg = await blergs.mint();
    await buildBlerg.wait();   
  
    let uri = await blergs.tokenURI(0);
    expect(uri).to.equal("uri://0000"); 

    await blergs["safeTransferFrom(address,address,uint256)"](accounts[0].address, accounts[1].address, 0)
    owner = await blergs.ownerOf(0)
    uri = await blergs.tokenURI(0);

    expect(owner ).to.equal(accounts[1].address);
    expect(uri).to.equal(`uri://0000`);

  });

  it("Transfer Blergs (with Traits) - Should be a blank Blerg after Transfer ", async function () {

    const accounts = await hre.ethers.getSigners();

    const TraitsFactory = await hre.ethers.getContractFactory("Traits");
    const traits = await TraitsFactory.deploy();
  
    await traits.deployed();
  
    const BlergsFactory = await hre.ethers.getContractFactory("Blergs");
    const blergs = await BlergsFactory.deploy();
  
    await blergs.deployed();
    await blergs.setTraitsAddress(traits.address)
    await traits.setBlergsAddress(blergs.address)
  
    const traits10 = [...Array(100).keys()];
    const array10 = Array(100).fill(1)
  
    await traits.connect(accounts[0]).mintBatch(traits10, array10)

    const traitsparam = [11,02,11,05,99];
    const buildBlerg = await blergs.mint();
    await buildBlerg.wait();   
    let uri = await blergs.tokenURI(0);
    expect(uri).to.equal(`uri://0000`);

    await blergs.setTraits(0, traitsparam)
    uri = await blergs.tokenURI(0);
    
    expect(uri).to.equal(`uri://${traitsparam[0]}_${traitsparam[1]}_${traitsparam[2]}_${traitsparam[3]}_${traitsparam[4]}_`);

    await blergs["safeTransferFrom(address,address,uint256)"](accounts[0].address, accounts[1].address, 0)
    owner = await blergs.ownerOf(0)
    uri = await blergs.tokenURI(0);

    expect(owner ).to.equal(accounts[1].address);
    expect(uri).to.equal(`uri://0000`);

  });

  it("Transfer Trait (used on Blerg) - Should disable/default any blergs with trait transfered", async function () {

    const accounts = await hre.ethers.getSigners();

    const TraitsFactory = await hre.ethers.getContractFactory("Traits");
    const traits = await TraitsFactory.deploy();
    await traits.deployed();
  
    const BlergsFactory = await hre.ethers.getContractFactory("Blergs");
    const blergs = await BlergsFactory.deploy();
    await blergs.deployed();
    await blergs.setTraitsAddress(traits.address)
    await traits.setBlergsAddress(blergs.address)
  

    const traits10 = [...Array(100).keys()];
    const array10 = Array(100).fill(1)
    await traits.connect(accounts[0]).mintBatch(traits10, array10)

    const traitsparam = [86,2,33,56,66];
    const mintWithTraits = await blergs.mintWithTraits(traitsparam);
    await mintWithTraits.wait(); 

    const uri = await blergs.tokenURI(0);
    expect(uri).to.equal(`uri://${traitsparam[0]}_${traitsparam[1]}_${traitsparam[2]}_${traitsparam[3]}_${traitsparam[4]}_`);

    traits.safeTransferFrom(accounts[0].address, accounts[1].address, 86, 1, '0x')
    let balance = await traits.balanceOf(accounts[0].address,86)
    console.log('BAL of 86', balance)
    const uriPostTransfer = await blergs.tokenURI(0);

    console.log(uriPostTransfer)
    expect(uriPostTransfer).to.equal(`uri://0000`);

  });

});
