const { ethers, network } = require("hardhat")
require("dotenv").config()
const fs = require("fs")
const frontEndContractsFile = "../nextjs-nftmarketplace/constants/networkMapping.json"
const frontEndAbi = "../nextjs-nftmarketplace/constants/"


module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updataAbi()
        console.log("Front end written!")
    }
}
async function updataAbi(){
    const nftMarketplace = await ethers.getContract("NftMarketPlace")
    fs.writeFileSync(
        `${frontEndAbi}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${frontEndAbi}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )

}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    const nftMarketplace = await ethers.getContract("NftMarketPlace")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketPlace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketPlace"].push(nftMarketplace.address)
        }
    } else {
        contractAddresses[chainId] = { NftMarketPlace: [nftMarketplace.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
  
}

module.exports.tags= ["all" ,"frontend"]