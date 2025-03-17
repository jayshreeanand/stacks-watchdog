require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

// Use a simpler configuration without the hardhat-toolbox
module.exports = {
  solidity: "0.8.20",
  networks: {
    stacks: {
      url: process.env.STACKS_RPC_URL || "https://stacks-node-api.mainnet.stacks.co",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: process.env.NETWORK_CHAIN_ID ? parseInt(process.env.NETWORK_CHAIN_ID) : 1
    },
    stacks_testnet: {
      url: process.env.STACKS_TESTNET_RPC_URL || "https://stacks-node-api.testnet.stacks.co",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 2147483648
    },
    hardhat: {
      forking: {
        url: process.env.STACKS_RPC_URL || "https://stacks-node-api.mainnet.stacks.co",
        blockNumber: process.env.FORK_BLOCK_NUMBER ? parseInt(process.env.FORK_BLOCK_NUMBER) : undefined
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 

