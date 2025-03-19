require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Ganache default RPC server
    },
    localhost: {
      url: "http://127.0.0.1:8545" // Hardhat local node
    }
  },
  mocha: {
    timeout: 100000 // Increase timeout for tests
  }
};