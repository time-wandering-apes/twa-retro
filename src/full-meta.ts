import * as fs from "fs";

async function main() {
    const baseFolderFiles = await new Promise<string[]>((res, rej) => fs.readdir("nfts/metadata", (err, files) => {
        if (err) rej(err);
        res(files);
    }))

    const meta: any[] = [];

    for (const file of baseFolderFiles) {
        meta.push(JSON.parse(fs.readFileSync(`nfts/metadata/${file}`, 'utf8')))
    }

    fs.writeFile(`nfts/metadata/full-meta.json`, JSON.stringify(meta, null, 4),(e) => {
        if(e) throw Error(e.message)
    })
}

main();
