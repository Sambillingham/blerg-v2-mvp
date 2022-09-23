require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.17",
  gasReporter: {
    currency: 'USD',
    coinmarketcap: process.env.COINCAP_API,
  }
};
