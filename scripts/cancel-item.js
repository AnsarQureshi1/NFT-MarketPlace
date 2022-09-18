const {ethers,network} = require("hardhat")
const{moveBlocks} = require("../utils/move-blocks")

const TOKEN_ID = 0

async function cancel(){
    const nftMarketPlace= await ethers.getContract("NftMarketPlace")
    const basicNft = await ethers.getContract("BasicNft")
    const tx = nftMarketPlace.cancelListing(basicNft.address , TOKEN_ID )
    //await tx.wait()
    console.log("NFT Cancelled")
    if(network.config.chainId=="31337"){
        moveBlocks(3, sleepAmount=1000)
    }
}

cancel()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })