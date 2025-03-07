require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    electroneum: {
      url: process.env.ELECTRONEUM_RPC_URL || "https://rpc.electroneum.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: process.env.NETWORK_CHAIN_ID ? parseInt(process.env.NETWORK_CHAIN_ID) : 1990, // Electroneum mainnet chain ID
    },
    electroneum_testnet: {
      url: process.env.ELECTRONEUM_TESTNET_RPC_URL || "https://testnet-rpc.electroneum.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1991, // Electroneum testnet chain ID
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
      electroneum: process.env.ELECTRONEUM_EXPLORER_API_KEY || "",
      electroneum_testnet: process.env.ELECTRONEUM_EXPLORER_API_KEY || ""
    },
    customChains: [
      {
        network: "electroneum",
        chainId: 1990,
        urls: {
          apiURL: "https://explorer.electroneum.com/api",
          browserURL: "https://explorer.electroneum.com"
        }
      },
      {
        network: "electroneum_testnet",
        chainId: 1991,
        urls: {
          apiURL: "https://testnet-explorer.electroneum.com/api",
          browserURL: "https://testnet-explorer.electroneum.com"
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