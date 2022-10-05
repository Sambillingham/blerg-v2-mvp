require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_ALCHEMY_KEY, 
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  gasReporter: {
    currency: 'USD',
    coinmarketcap: process.env.COINCAP_API,
  }
};
