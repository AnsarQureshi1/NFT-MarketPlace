const Moralis = require("moralis/node")
require("dotenv").config()
const contractAddresses = require("./constants/networkMapping.json")
let chainId = 31337
let moralisChainId = chainId == "31337" ? "1337" : chainId
const contractAddress = contractAddresses[chainId]["NftMarketPlace"][0]

const serverUrl ="https://txjtfdgojmmf.usemoralis.com:2053/server"
const appId ="lgvq2FDr8YezFUkcMOneTyqWXIlOWBjGkgDv0KnZ"
const masterKey ="TWUcJM54CIxS57UCObv6r3yMdbGCeLq8MENOAC9B"

async function main(){
     await Moralis.start({serverUrl ,appId,masterKey})
     console.log(`working with contract address ${contractAddress}`)

     let itemListedOption ={
        chainId : moralisChainId,
        sync_historical:true ,
        topic:"ItemListed(address,address,uint256,uint256)",
        address: contractAddress,
        abi:   {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "seller",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "nftAddress",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
              }
            ],
            "name": "ItemListed",
            "type": "event"
          },
          tableName:"ItemListed"
     }

     let itemBoughtOption ={
        chainId : moralisChainId,
        sync_historical:true ,
        topic:"ItemBought(address,address,uint256,uint256)",
        address: contractAddress,
        abi:   {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "nftAddress",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
              }
            ],
            "name": "ItemBought",
            "type": "event"
          },
          tableName:"ItemBought"
     }
     let itemCancelledOption = {
        chainId : moralisChainId,
        sync_historical:true ,
        topic:"ItemCancelled(address,address,uint256)",
        address: contractAddress,
        abi:   {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "seller",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "nftAddress",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              }
            ],
            "name": "ItemCancelled",
            "type": "event"
          },
          tableName:"ItemCancelled"

     }
     const listedResponse = await Moralis.Cloud.run("watchContractEvent" , itemListedOption,{
        useMasterKey:true
     })

     const boughtRespone = await Moralis.Cloud.run("watchContractEvent" , itemBoughtOption,{
        useMasterKey:true
     })

     const cancelledResponse = await Moralis.Cloud.run("watchContractEvent" , itemCancelledOption,{
        useMasterKey:true
     })

     if(listedResponse.success && boughtRespone.success && cancelledResponse.success){
        console.log("success! database updated and watching event")
     }else{
        console.log("something went wrong....")
     }
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })