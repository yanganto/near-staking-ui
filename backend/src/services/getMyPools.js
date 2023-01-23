import {testnet_Pools, mainnet_Pools} from "../models/mPools.js";

export const getMyPools = async (req, res) => {
	try {
		const Pools = req.body.network === 'mainnet' ? mainnet_Pools : testnet_Pools;
		const myPools = await Pools.find({ account_id: req.body.account_id })
			.select({ "_id": 0, "__v": 0, "account_id": 0 })
		res.send({ myPools });
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.send({ error: 'Please try again' });
	}
}
