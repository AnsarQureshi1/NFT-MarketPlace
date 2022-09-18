import { ConnectButton} from "@web3uikit/web3"
import Link from 'next/link'

export default function Header(){
    return(
        <nav className="p-5 border-b-2 flex flex-row justify-between item-center">
            <h1 className="py-4 px-4 font-bold text-3xl">NFT SOUQ</h1>
            <div className=" flex flex-row item-center" >
            <Link href="/">
                <a className="mr-4 p-6">
                    Home
                </a>
            </Link>
            <Link href="/sell-nft">
                <a className="mr-4 p-6">
                    NFT SELL
                </a>
            </Link>
             <ConnectButton moralisAuth={false}/>
             </div>
        </nav>
      
    )
}