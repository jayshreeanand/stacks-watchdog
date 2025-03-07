require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    electroneum: {
      url: process.env.ELECTRONEUM_RPC_URL || "https://rpc.electroneum.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1990, // Electroneum chain ID
    },
    hardhat: {
      forking: {
        url: process.env.ELECTRONEUM_RPC_URL || "https://rpc.electroneum.com",
        blockNumber: process.env.FORK_BLOCK_NUMBER ? parseInt(process.env.FORK_BLOCK_NUMBER) : undefined,
      }
    }
  },
  etherscan: {
    apiKey: {
      electroneum: process.env.ELECTRONEUM_EXPLORER_API_KEY || ""
    },
    customChains: [
      {
        network: "electroneum",
        chainId: 1990,
        urls: {
          apiURL: "https://explorer.electroneum.com/api",
          browserURL: "https://explorer.electroneum.com"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
}; 