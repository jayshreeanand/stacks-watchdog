require("dotenv").config();

// Use a simpler configuration without the hardhat-toolbox
module.exports = {
  solidity: "0.8.20",
  networks: {
    electroneum: {
      url: process.env.ELECTRONEUM_RPC_URL || "https://rpc.electroneum.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: process.env.NETWORK_CHAIN_ID ? parseInt(process.env.NETWORK_CHAIN_ID) : 1990
    },
    electroneum_testnet: {
      url: process.env.ELECTRONEUM_TESTNET_RPC_URL || "https://rpc.ankr.com/electroneum_testnet",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5201420
    },
    hardhat: {
      forking: {
        url: process.env.ELECTRONEUM_RPC_URL || "https://rpc.electroneum.com",
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