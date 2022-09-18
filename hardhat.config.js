require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
const RINKEBY_RPC_URL =
    process.env.RINKEBY_RPC_URL 
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
        },
        rinkeby: {
            url: "https://eth-rinkeby.alchemyapi.io/v2/nm-KuUiUd_KfM6MNQiW8H9JKN7VTPiQJ",
            accounts: ["c8c88b0edfc2d77348c2c4bff2ed2d05dd08f113903e1f5f73b3346f97c20354"],
            chainId: 4,
            blockConfirmations: 6,
        },
    },
    solidity: {
        compilers: [
          {
            version: "0.6.0",
          },
            {
                version: "0.8.8",
            },
            {
                version: "0.6.6",
            },
           
        ],
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
}
