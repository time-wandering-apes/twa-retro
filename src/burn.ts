import * as fs from "fs";

const burned = [
    671,
    196,
    2303,
    672,
    2181,
    1970,
    479,
    959,
];

const animated = [
    1076,
    1166,
    1235,
    288
];

async function main() {
    for(const it of burned) {
        const file = JSON.parse(fs.readFileSync(`nfts/metadata/${it - 1}.json`, 'utf8'));
        file.name = file.name.replace("Ape.pixel", "Ape.pixel.burned");
        file.image = file.image.replace(`${it - 1}.png`, "burned.png");
        fs.writeFile(`nfts/metadata/${it - 1}.json`, JSON.stringify(file, null, 4),(e) => {
            if(e) throw Error(e.message)
        })
        await new Promise(res => setTimeout(res, 200))
    }


    for(const it of animated) {
        const file = JSON.parse(fs.readFileSync(`nfts/metadata/${it - 1}.json`, 'utf8'));
        file.image = file.image.replace(`${it - 1}.png`, `${it - 1}.gif`);
        file.attributes.unshift({
            "trait_type": "Animation",
            "value": "GIF"
        })
        fs.writeFile(`nfts/metadata/${it - 1}.json`, JSON.stringify(file, null, 4),(e) => {
            if(e) throw Error(e.message)
        })
        await new Promise(res => setTimeout(res, 200))
    }
}

main();
