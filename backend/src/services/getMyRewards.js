import {mainnet_DelegationRewards, testnet_DelegationRewards} from "../models/mDelegationRewards.js";


const getDRewards = async (network, account_id, pool, group, dateFrom, dateTo) => {
	const DelegationRewards = network === 'mainnet' ? mainnet_DelegationRewards : testnet_DelegationRewards;
	const dateTo2 = new Date(dateTo);
	dateTo2.setUTCHours(0, 0, 0, 0);
	dateTo2.setDate(dateTo2.getDate() + 1);

	const dRewards = await DelegationRewards.aggregate([
		{
			"$match": {
				"account_id": account_id,
				"pool": pool,
				date: {
					$gte: new Date(dateFrom),
					$lt: dateTo2
				}
			}
		},
		{
			$group: {
				_id: {
					$dateToString: {
						format: group,
						date: "$date"
					}
				}, count: { $sum: 1 }, totalAmount: { $sum: "$rewards" }
			}
		},
		{ $sort: { _id: 1 } }
	]);

	return {
		labels: dRewards.map((data) => data._id), datasets: [{
			label: pool,
			data: dRewards.map((data) => data.totalAmount.toString()),
			borderColor: 'rgba(94, 48, 235, 0.8)',
			backgroundColor: 'rgba(94, 48, 235, 0.8)',
		}]
	}
}

export const getMyRewards = async (req, res) => {
	try {
		const group = ['%Y', '%Y-%m', '%Y-%m-%d'].includes(req.body.group) ? req.body.group : '%Y-%m-%d %H:%M';
		const dRewards = await getDRewards(req.body.network, req.body.account_id, req.body.pool, group, req.body.dateFrom, req.body.dateTo);
		res.send({ dRewards });
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.send({ error: 'Please try again' });
	}
}
