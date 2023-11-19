import * as fs from "fs";


export async function updateFullMeta() {
    fs.writeFile(`nfts/metadata/full-meta.json`, "",(e) => {
        if(e) throw Error(e.message)
    })

    const baseFolderFiles = (await new Promise<string[]>((res, rej) => fs.readdir("nfts/metadata", (err, files) => {
        if (err) rej(err);
        res(files);
    }))).filter(it => it !== "full-meta.json")

    const meta: any[] = [];

    for (const file of baseFolderFiles) {
        meta.push(JSON.parse(fs.readFileSync(`nfts/metadata/${file}`, 'utf8')))
    }

    fs.writeFile(`nfts/metadata/full-meta.json`, JSON.stringify(meta, null, 4),(e) => {
        if(e) throw Error(e.message)
    })
}

function main() {
    updateFullMeta();
}

main();
