import { useState ,useEffect } from "react";
import { useWeb3Contract ,useMoralis} from "react-moralis";
import nftAbi from "../constants/BasicNft.json"



export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
     const {isWeb3Enabled} = useMoralis()
     const [imageURI, setImageURI] = useState("")

     const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    async function updateUI(){
        const tokenURI = await getTokenURI()
        console.log(`the tokenURI is${tokenURI}`)

    }

    useEffect(()=>{
        if(isWeb3Enabled){
            updateUI()
        }
      
    },[isWeb3Enabled])
   

    
}