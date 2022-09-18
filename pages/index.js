
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useMoralisQuery ,useMoralis } from "react-moralis";
import NFTBox from '../components/NFTBox';

export default function Home() {
 
  const { isWeb3Enabled } = useMoralis()
  const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
      // TableName
      // Function for the query
      "ActiveItem",
      (query) => query.limit(10).descending("tokenId")
  )
  console.log(listedNfts)

 
  return (
    <div className={styles.container}>
       {fetchingListedNfts ? (<div>Loading.....</div>)
       :
        (listedNfts.map((nft) => {
          console.log(nft.attributes)
          const{price , tokenId , nftAddress , marketplaceAddress ,seller }=nft.attributes 
            return(
              <div>
                Price: {price}
                Address: {nftAddress}
                TokenId:{tokenId}
                Seller : {seller}

                <NFTBox
                 price ={price}
                 tokenId={tokenId}
                 nftAdress = {nftAddress}
                 marketplaceAddress={marketplaceAddress}
                 seller = {seller}
                 key ={`${nftAddress}${tokenId}`}
                />
              </div>
            )
        }))
        
      }
      
      
    </div>
  )
}
