import {mainnet_Accounts, testnet_Accounts} from "../models/mAccounts.js";


export const addAccount = async (req, res) => {
	try {
		const Accounts = req.body.network === 'mainnet' ? mainnet_Accounts : testnet_Accounts;
		Accounts.findOneAndUpdate({ account_id: req.body.account_id },
			{
				account_id: req.body.account_id,
			}, { upsert: true }).then().catch(e => console.log(e));
		res.send({ status: 'ok' });
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.send({ error: 'Please try again' });
	}
}
