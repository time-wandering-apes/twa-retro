import axios from "axios";
import config, { TON_REQ_HEADER } from "./config";
import { Address } from "ton-core";
import { Nft, Txn } from "./types";

export class TonService {

    static async getCollectionsNfts(collection: string): Promise<Nft[]> {
        try {
            const response = (await axios.get(`${config.TON_API_URL}/nfts/collections/${collection}/items?`+ new URLSearchParams({
                limit: "1000",
                offset: "0",
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

    static async getTxns(address: string): Promise<Txn[]> {
        try {
            const responses: Txn[] =[];

            for (let i = 0; i < [...new Array(1)].length; i++) {
                await new Promise(res => setTimeout(res, 1000))
                const { data } = await axios.get(`${config.TON_API_URL}/blockchain/accounts/${address}/transactions?`+ new URLSearchParams({
                    "after_lt": `${1000 * i}`,
                    "limit": "1000"
                }).toString(), TON_REQ_HEADER);

                responses.push(...data.transactions.map(it => ({
                    ...it,
                    utime: it.utime,
                    account: {
                        address: Address.parseRaw(it.account.address),
                        is_scam: it.account.is_scam
                    },
                    in_msg: {
                        ...it.in_msg,
                        destination: it.in_msg.destination ? {
                            address: Address.parseRaw(it.in_msg.destination.address),
                            is_scam: it.in_msg.destination.is_scam
                        } : undefined,
                        source:  it.in_msg.source ? {
                            address: Address.parseRaw(it.in_msg.source.address),
                            is_scam: it.in_msg.source.is_scam
                        } : undefined,
                        decoded_body: it.in_msg.decoded_body ? {
                            text: it.in_msg.decoded_body.text,
                            query_id: it.in_msg.decoded_body.query_id,
                            prev_owner: it.in_msg.decoded_body.prev_owner ? Address.parseRaw(it.in_msg.decoded_body.prev_owner) : undefined,
                            forward_payload: it.in_msg.decoded_body.forward_payload
                        } : undefined
                    }
                })))
            }

            return responses;
        } catch (e: any) {
            const errorData = e.response?.data;
            throw Error((errorData || {}).error || (errorData || {}).message || errorData || e.message)
        }
    }

    static formatBalanceFromView(num: number) {
        return num * 10 ** 9
    }
}
