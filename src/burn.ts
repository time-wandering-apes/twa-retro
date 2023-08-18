import * as fs from "fs";
import { TonService } from "./ton.service";

const animated = [
    4
];

async function main() {
    const toBurn = (await TonService.getNftsForTargetCollections(
        "EQD__________________________________________0vo",
        "EQDaX_LSY6zxC8qgmTctL1jD8Pa6y6-RWmqgrRcMCTBONx0R"
    )).filter(it => (
        !it.metadata.name.includes("burned")
    ))

    console.log(`NFT's to burn: ${toBurn.length}`)

    for(const it of toBurn) {
        const ind = +it.metadata.name.split("Ape.pixel #")[1]

        const file = JSON.parse(fs.readFileSync(`nfts/metadata/${ind - 1}.json`, 'utf8'));

        if (it.metadata.name.includes("burned") || file.name.includes("burned")) {
            console.log(`Skip ${it.metadata.name}`)
            continue;
        }

        file.name = file.name.replace("Ape.pixel", "Ape.pixel.burned");
        file.image = file.image.replace(`${ind - 1}.png`, "burned.gif");
        fs.writeFile(`nfts/metadata/${ind - 1}.json`, JSON.stringify(file, null, 4),(e) => {
            if(e) throw Error(e.message)
        })
        await new Promise(res => setTimeout(res, 200))
    }


    for(const it of animated) {
        const file = JSON.parse(fs.readFileSync(`nfts/metadata/${it - 1}.json`, 'utf8'));

        if (!file.image.includes(".gif")) {
            file.image = file.image.replace(`${it - 1}.png`, `${it - 1}.gif`);
        }

        if (!file.attributes.some(it => it.trait_type === "Animation")) {
            file.attributes.unshift({
                "trait_type": "Animation",
                "value": "GIF"
            })
        }

        fs.writeFile(`nfts/metadata/${it - 1}.json`, JSON.stringify(file, null, 4),(e) => {
            if(e) throw Error(e.message)
        })
        await new Promise(res => setTimeout(res, 200))
    }
}

main();
