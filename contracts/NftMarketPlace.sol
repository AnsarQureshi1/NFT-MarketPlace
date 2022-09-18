// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NftMarketPlace__PriceMustBeAboveZero();
error NftMarketPlace__NotApprovedForMarketPlace();
error NftMarketPlace__NotListed();
error  NftMarketPlace__AlreadyListed();
error NftMarketPlace__NotOwner();
error  NftMarketPlace__PriceNotMet(address nftAddress , uint256 tokenId , uint256 price);
error  NftMarketPlace__NoProceeds();

contract NftMarketPlace is ReentrancyGuard{

struct Listing{
    address seller ;
    uint256 price ;
}
event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );


event ItemCancelled(
    address indexed seller, 
    address indexed nftAddress ,
    uint256 tokenId);


    

event ItemListed(
    address indexed seller, 
    address indexed nftAddress ,
     uint256 tokenId,
     uint256 price);


mapping(address => mapping(uint256=>Listing)) private s_Listing ;
mapping(address => uint256) private s_proceeds;

modifier notListed(address nftAddress , uint256 tokenId , address owner){
    Listing memory listing = s_Listing[nftAddress][tokenId];

    if(listing.price > 0){
        revert  NftMarketPlace__AlreadyListed();
    }
    _;
}


modifier isListed(address nftAddress , uint256 tokenId){
    Listing memory listing = s_Listing[nftAddress][tokenId];

    if(listing.price <=0){
        revert  NftMarketPlace__NotListed();
    }
    _;
}

modifier isOwner(address nftAddress , uint256 tokenId , address spender){
    IERC721 nft =IERC721(nftAddress);
    address owner = nft.ownerOf(tokenId);
    if(spender != owner){
         revert NftMarketPlace__NotOwner();
    }
    _;
}
    function listItem(address nftAddress , uint256 tokenId , uint256 price) 
      external
      notListed(nftAddress , tokenId , msg.sender)
      isOwner(nftAddress , tokenId , msg.sender)
     {
        if(price <= 0){
            revert NftMarketPlace__PriceMustBeAboveZero();
        }
        IERC721 nft =IERC721(nftAddress);
        if( nft.getApproved(tokenId) !=address(this)){
            revert NftMarketPlace__NotApprovedForMarketPlace();

        }
        s_Listing[nftAddress][tokenId]= Listing(msg.sender, price);

        emit ItemListed(msg.sender,nftAddress , tokenId , price);


    }


    function buyItem(address nftAddress , uint256 tokenId) 
    external
    payable
    isListed(nftAddress ,tokenId )
    nonReentrant {
         Listing memory listing = s_Listing[nftAddress][tokenId];

         if(msg.value < listing.price){
            revert  NftMarketPlace__PriceNotMet(nftAddress , tokenId , listing.price);
         }
         s_proceeds[listing.seller] += msg.value;
         delete(s_Listing[nftAddress][tokenId]);
         IERC721(nftAddress).safeTransferFrom(listing.seller, msg.sender, tokenId);
         emit ItemBought(msg.sender , nftAddress ,tokenId, listing.price);

    }

    function cancelListing(address nftAddress , uint256 tokenId ) 
     external
     isListed(nftAddress , tokenId)
     isOwner(nftAddress  , tokenId , msg.sender){
        delete(s_Listing[nftAddress][tokenId]);
        emit ItemCancelled(msg.sender , nftAddress , tokenId);

     }

    function updateListing(address nftAddress , uint256 tokenId , uint256 newPrice)
      external 
      isListed(nftAddress, tokenId)
      isOwner(nftAddress , tokenId , msg.sender)
      {
        if (newPrice <=0){
            revert  NftMarketPlace__PriceMustBeAboveZero();
        }
        s_Listing[nftAddress][tokenId].price = newPrice ;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
      }

    function withdrawProceed() external {
        uint256 proceeds = s_proceeds[msg.sender];

        if(proceeds<=0){
            revert NftMarketPlace__NoProceeds();
        }
        s_proceeds[msg.sender] = 0 ;
        (bool success ,)= payable(msg.sender).call{value:proceeds}("");
        require(success, "transferFailed");
    }

    function getListing(address nftAddress , uint256 tokenId) external view returns(Listing memory){
         return s_Listing[nftAddress][tokenId];
    }
    function getProceeds(address seller) external view returns(uint256){
        return s_proceeds[seller];
    }
}