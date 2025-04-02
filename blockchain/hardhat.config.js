require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    ganache: {
      url: "http://localhost:7545",
      chainId: 5777,
      accounts: {
        mnemonic: "someone toilet under blind write misery tuition report basket such reopen current",
      },
    },
  },
};