const { network, ethers } = require("hardhat")
const { developmentChains} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const args = []

    let basicNft = await deploy("BasicNft" , {
        from:deployer,
        log:true,
        args: args,
        waitConfirmation:2 ,
    })

    log("--------------------------------------------------------")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(basicNft.address, arguments)
    }


}

module.exports.tags = ["all" , "basicNft"]