import axios from "axios";
import config, { TON_REQ_HEADER } from "./config";
import { Address } from "ton-core";
import { Nft } from "./types";

export class TonService {

    static async getNftsForTargetCollections(account: string, collection: string): Promise<Nft[]> {
        try {
            const response = (await axios.get(`${config.TON_API_URL}/accounts/${account}/nfts?`+ new URLSearchParams({
                collection,
                limit: "1000",
                offset: "0",
                "indirect_ownership": "false",
            }).toString(), TON_REQ_HEADER)).data.nft_items

            return response.map(it => ({
                ...it,
                address: Address.parseRaw(it.address).toString(),
                collection: {
                    ...it.collection,
                    address: Address.parseRaw(it.collection.address).toString(),
                }
            }));
        } catch (e: any) {
            const errorData = e.response?.data;
            throw Error((errorData || {}).error || (errorData || {}).message || errorData || e.message)
        }
    }

    static formatBalanceFromView(num: number) {
        return num * 10 ** 9
    }
}
