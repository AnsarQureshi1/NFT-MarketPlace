const { network } = require("hardhat")
const { developmentChains} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    

    log("-----------------------------------------------------------")

    const args = []

    const nftMp = await deploy("NftMarketPlace",{
        from:deployer,
        log:true,
        args:args,
        waitConfirmation:2,
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(nftMp.address, arguments)
    }
    log("------------------------------------------------------------")
}

module.exports.tags=["all" , "nftMarketPlace"]