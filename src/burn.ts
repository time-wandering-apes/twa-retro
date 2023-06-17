import { resolve } from "dns";
import * as fs from "fs";

const apesNumbers = [
    1856,
    1546,
    1984,
    2009,
    1379,
    1728,
    1512,
    766,
    2228,
];

async function main() {
    for(const it of apesNumbers) {
        const file = JSON.parse(fs.readFileSync(`nfts/metadata/${it - 1}.json`, 'utf8'));
        file.name = file.name.replace("Ape.pixel.burned.burned", "Ape.pixel.burned");
        file.image = file.image.replace(`${it - 1}.png`, "burned.png");
        fs.writeFile(`nfts/metadata/${it - 1}.json`, JSON.stringify(file, null, 4),(e) => {
            if(e) throw Error(e.message)
        })
        console.log(file)
        await new Promise(res => setTimeout(res, 200))
    }
}

main();
