import {testnet_Rewards, mainnet_Rewards} from "../models/mRewards.js";

export const getMyRewards = async (req, res) => {
	try {
		const group = ['%Y', '%Y-%m'].includes(req.body.group) ? req.body.group : '%Y-%m-%d';
		const Rewards = req.body.network === 'mainnet' ? mainnet_Rewards : testnet_Rewards;
		const myRewards = await Rewards.aggregate([
			{ "$match": { "account_id": req.body.account_id } },
			{
				$group: {
					_id: {
						$dateToString: {
							format: group,
							date: { $toDate: { $divide: ["$block_timestamp", 1000000] } }
						}
					}, count: { $sum: 1 }, totalAmount: { $sum: "$amount" }
				}
			},
			{ $sort: { _id: 1 } }
		])

		res.send({ myRewards });
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.send({ error: 'Please try again' });
	}
}
