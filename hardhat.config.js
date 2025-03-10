require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

// Use a simpler configuration without the hardhat-toolbox
module.exports = {
  solidity: "0.8.20",
  networks: {
    sonic: {
      url: process.env.SONIC_RPC_URL || "https://rpc.soniclabs.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: process.env.NETWORK_CHAIN_ID ? parseInt(process.env.NETWORK_CHAIN_ID) : 146
    },
    sonic_testnet: {
      url: process.env.SONIC_TESTNET_RPC_URL || "https://rpc.blaze.soniclabs.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 57054
    },
    hardhat: {
      forking: {
        url: process.env.SONIC_RPC_URL || "https://rpc.soniclabs.com",
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

