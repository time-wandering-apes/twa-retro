export type Nft = {
    address: string,
    approved_by: null,
    collection: {
        address: string,
        name: string
    },
    index: number,
    metadata: {
        name: string,
        description: string,
        marketplace: string,
        attributes: { "trait_type": string, "value": string }[],
        image: string
    },
    owner: {
        address: string,
        icon: string,
        is_scam: false,
        name: string, // domain
    },
    verified: true
}
