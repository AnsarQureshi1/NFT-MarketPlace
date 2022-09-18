const {expect , assert} = require("chai")
const {network , deployments , ethers} = require("hardhat")
const { developmentChains} = require("../../helper-hardhat-config")

 !developmentChains.includes(network.name)
    ?describe.skip
    :describe("NFT MarketPlace Unit Testing" , function(){
        let nftMarketplace , nftMarketplaceContract , basicNft , basicNftContract
        const PRICE = ethers.utils.parseEther("0.1")
        const TOKEN_ID = 0

        beforeEach(async ()=>{

            accounts = await ethers.getSigners()
            deployer=accounts[0]
            player= accounts[1]
            await deployments.fixture(["all"])
            nftMarketplaceContract = await ethers.getContract("NftMarketPlace")
            nftMarketplace = await nftMarketplaceContract.connect(deployer)
            basicNftContract = await ethers.getContract("BasicNft")
            basicNft = await basicNftContract.connect(deployer)
            await basicNft.mintNft()
            await basicNft.approve(nftMarketplaceContract.address , TOKEN_ID)

        })

        describe("list Item" , function(){
            it("Event Trigger when List an Item" , async()=>{
                expect(nftMarketplace.listItem(basicNft.address , TOKEN_ID , PRICE)).to.emit("ItemListed")
            })
            it("when nft is Already listed" , async()=>{
                await nftMarketplace.listItem(basicNft.address,TOKEN_ID,PRICE)

                await expect(nftMarketplace.listItem(basicNft.address,TOKEN_ID,PRICE)).to.be.reverted
            })
            it("only owner can list" , async()=>{
                nftMarketplace = await nftMarketplaceContract.connect(player)

                await basicNft.approve(player.address , TOKEN_ID)

                await expect(nftMarketplace.listItem(basicNft.address,TOKEN_ID,PRICE)).to.be.reverted
            })
            it("need approval first" , async()=>{
                await basicNft.approve(ethers.constants.AddressZero,TOKEN_ID)

                await expect(nftMarketplace.listItem(basicNft.address,TOKEN_ID,PRICE)).to.be.reverted
            })
            it("updates listing " , async()=>{
                await nftMarketplace.listItem(basicNft.address,TOKEN_ID,PRICE)
                const listing = await nftMarketplace.getListing(basicNft.address , TOKEN_ID)

                assert.equal(listing.price.toString(),PRICE.toString())
                assert.equal(listing.seller.toString(),deployer.address)
            })
        })

        describe("cancel Listing", function(){
             it("reverts if there is no list",async()=>{
                await expect(nftMarketplace.cancelListing(basicNft.address , TOKEN_ID)).to.be.reverted
             })
             it("revert when other than owner try",async()=>{
                nftMarketplace = await nftMarketplaceContract.listItem(basicNft.address,TOKEN_ID,PRICE)
                nftMarketplace = await nftMarketplaceContract.connect(player)
                await basicNft.approve(player.address,TOKEN_ID)

                await expect(nftMarketplace.cancelListing(basicNft.address,TOKEN_ID)).to.be.reverted
             })

             it("emits an event and cancel listing",async()=>{
                await nftMarketplace.listItem(basicNft.address , TOKEN_ID,PRICE)
                expect(await nftMarketplace.cancelListing(basicNft.address , TOKEN_ID)).to.emit("ItemCanceled")

                const listing = await nftMarketplace.getListing(basicNft.address , TOKEN_ID)
                assert.equal(listing.price.toString(),"0")
             })

        })

        describe("buy items" ,function(){
            it("reverts if not listed", async()=>{
                await expect(nftMarketplace.buyItem(basicNft.address , TOKEN_ID)).to.be.reverted
            })

            it("change the buyer",async()=>{
                
                await nftMarketplace.listItem(basicNft.address , TOKEN_ID,PRICE)
                nftMarketplace = await nftMarketplaceContract.connect(player)

                expect( await nftMarketplace.buyItem(basicNft.address,TOKEN_ID,{value:PRICE})).to.emit("ItemBought")

                const newOwner = await basicNft.ownerOf(TOKEN_ID)
                const deployerProceeds = await nftMarketplace.getProceeds(deployer.address)

                assert.equal(newOwner.toString() , player.address)
                assert.equal(deployerProceeds.toString(),PRICE,toString())
            


                
            })
        })
        describe("withdrawProceeds" , async()=>{
            it("withdraw" ,async()=>{
                await nftMarketplace.listItem(basicNft.address , TOKEN_ID,PRICE)
                nftMarketplace = await nftMarketplaceContract.connect(player)

                await nftMarketplace.buyItem(basicNft.address,TOKEN_ID,{value:PRICE})
                nftMarketplace = await nftMarketplaceContract.connect(deployer)

                const deployProceedsBefore = await nftMarketplace.getProceeds(deployer.address)
                const deployerBalanceBefore =await deployer.getBalance()
                const txResponse = await nftMarketplace.withdrawProceed()
                const transRecip = await txResponse.wait(1)

                const { gasUsed, effectiveGasPrice } = transRecip
                const gasCost = gasUsed.mul(effectiveGasPrice)
                const deployerBalanceAfter = await deployer.getBalance()

                assert(deployerBalanceAfter.add(gasCost).toString(),deployProceedsBefore.add(deployerBalanceBefore).toString())
            }
            )
        })

    })