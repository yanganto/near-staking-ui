import near from 'near-api-js';
import bs58 from 'bs58';
import {utils} from "near-api-js";


const verifyPublicKey = async (accountId, publicKey, network) => {
	const NEAR_RPC_URL = network === 'mainnet' ? process.env.MAINNET_NEAR_RPC_URL : process.env.TESTNET_NEAR_RPC_URL;
	const connectionInfo = { url: NEAR_RPC_URL };
	const provider = new near.providers.JsonRpcProvider(connectionInfo);
	const response = await provider.query({
		request_type: "view_access_key_list",
		finality: "optimistic",
		account_id: accountId,
	});
	return response.keys.find(key => key.public_key === publicKey);
}


export const verifySignature = async (accountId, publicKey, signature, message, network) => {
	try {
		if (await verifyPublicKey(accountId, publicKey, network)) {
			const sign = bs58.decode(signature);
			const msg = Buffer.from(message);
			const pk = utils.PublicKey.fromString(publicKey);
			return pk.verify(msg, sign);
		} else {
			return false;
		}
	} catch (e) {
		//console.log(e);
		return false;
	}
}
