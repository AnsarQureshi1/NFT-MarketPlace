

Moralis.Cloud.afterSave("ItemListed", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed TX...")
    if (confirmed) {
        logger.info("Found item!")
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        // In case of listing update, search for already listed ActiveItem and delete
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("seller", request.object.get("seller"))
        logger.info(`Marketplace | Query: ${query}`)
        const alreadyListedItem = await query.first()
        console.log(`alreadyListedItem ${JSON.stringify(alreadyListedItem)}`)
        if (alreadyListedItem) {
            logger.info(`Deleting ${alreadyListedItem.id}`)
            await alreadyListedItem.destroy()
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get(
                    "address"
                )} since the listing is being updated. `
            )
        }

        // Add new ActiveItem
        const activeItem = new ActiveItem()
        activeItem.set("marketplaceAddress", request.object.get("address"))
        activeItem.set("nftAddress", request.object.get("nftAddress"))
        activeItem.set("price", request.object.get("price"))
        activeItem.set("tokenId", request.object.get("tokenId"))
        activeItem.set("seller", request.object.get("seller"))
        logger.info(
            `Adding Address: ${request.object.get("address")} TokenId: ${request.object.get(
                "tokenId"
            )}`
        )
        logger.info("Saving...")
        await activeItem.save()
    }
})

Moralis.Cloud.afterSave("ItemCanceled", async(request)=>{
    const confirmed = request.get.object("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`marketplace | object :${request.object}`)
    if(confirmed){
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query  = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))

        logger.info(`marketplace | query ${query}`)
        const cancelItem = query.first()
        if(cancelItem){
            logger.info(`deleting ${request.object.get("tokenId")} at address ${ request.object.get("address")}`)
            await cancelItem.destroy()
        }else{
            logger.info(`item not found on this add ${ request.object.get("address")} and tokenId ${request.object.get("tokenId")}`)
        }
    }
})

Moralis.Cloud.afterSave("ItemBought", async(request)=>{
    const confirmed = request.get.object("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`marketplace | object :${request.object}`)
    if(confirmed){
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query  = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))

        logger.info(`marketplace | query ${query}`)
        const boughtItem = query.first()
        if(boughtItem){
            logger.info(`deleting ${request.object.get("objectId")} `)
            await boughtItem.destroy()
        }else{
            logger.info(`item not found on this add ${ request.object.get("address")} and tokenId ${request.object.get("tokenId")}`)
        }
    }
})