import * as fs from "fs";

async function main() {

    const baseFolder = './nfts/metadata';

    const baseFolderFiles = await new Promise<string[]>((res, rej) => fs.readdir(baseFolder, (err, files) => {
        if (err) rej(err);
        res(files);
    }))

    for (let i = 0; i < baseFolderFiles.length; i++) {
        const folder = baseFolderFiles[i];
        const json = JSON.parse(fs.readFileSync(`${baseFolder}/${folder}`, 'utf8'));

        if (!json.name.includes("burned")) continue;

        json.image = json.image.replace(`burned.png`, "burned.gif");

        await new Promise<void>(res => fs.writeFile(`${baseFolder}/${folder}`, JSON.stringify(json, null, 4), (e) => {
            if (e) console.error(e)
            res();
        }))
    }
}

main()
