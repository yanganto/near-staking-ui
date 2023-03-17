import {mainnet_Pools, testnet_Pools} from "../models/mPools.js"
import {getOwnerId} from "../helpers/updateDelegationRewards.js";
//import {verifySignature} from "../helpers/near.js";


export const addExistingValidator = async (req, res) => {
	try {
		const network = req.body.network === 'mainnet' ? 'mainnet' : 'testnet';
		/*
		if (!await verifySignature(req.body.account_id, req.body.public_key, req.body.signature, req.body.pool_id, network)) {
			res.status(401).send({ error: 'Unauthorized' });
			return
		}
		*/
		const owner_id = await getOwnerId(network, req.body.pool_id);
		if (owner_id) {
			const Pools = req.body.network === 'mainnet' ? mainnet_Pools : testnet_Pools;
			Pools.findOneAndUpdate({ account_id: req.body.account_id, pool_id: req.body.pool_id },
				{
					account_id: req.body.account_id, pool_id: req.body.pool_id, owner_id: owner_id
				}, { upsert: true }).then().catch(e => console.log(e));
		}
		res.send({ status: 'ok' });
	} catch (e) {
		console.log(e);
		res.status(500).send({ error: 'Please try again' });
	}
}
