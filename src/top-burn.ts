import { TonService } from "./ton.service";
import { uniq } from "lodash";
import * as fs from "fs";



async function main() {
    const txns = await TonService.getTxns("EQD__________________________________________0vo");
    const burnedNfts = await TonService.getNftsForTargetCollections(
        "EQD__________________________________________0vo",
        "EQDaX_LSY6zxC8qgmTctL1jD8Pa6y6-RWmqgrRcMCTBONx0R"
    )

    const nftsTxns = txns.filter(it => (
        it.in_msg.source
        && burnedNfts.some(nft => nft.address.toString() === it.in_msg.source!.address.toString())
    ))

    const prevOwners = uniq(nftsTxns.map(it => it.in_msg.decoded_body?.prev_owner?.toString()).filter(it => it)) as string[];

    const top = prevOwners.map((address) => {
        return {
            address,
            count: nftsTxns.filter(it => it.in_msg.decoded_body?.prev_owner?.toString() === address).length
        }
    })
    .sort((a, b) => b.count - a.count)
    .map(({ address, count }) => {
        return `${address.slice(0, 6)}...${address.slice(address.length - 6)} => ${count}`
    })

    fs.writeFile("top-burn.txt", JSON.stringify(top, null, 4), (err) => {
        if (err) throw Error(err.message)
    })
}

main();
