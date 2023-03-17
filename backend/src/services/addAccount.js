import {mainnet_Accounts, testnet_Accounts} from "../models/mAccounts.js";
//import {verifySignature} from "../helpers/near.js";


export const addAccount = async (req, res) => {
	try {
		const network = req.body.network === 'mainnet' ? 'mainnet' : 'testnet';
		/*
		if (!await verifySignature(req.body.account_id, req.body.public_key, req.body.signature, req.body.account_id, network)) {
			res.status(401).send({ error: 'Unauthorized' });
			return
		}
		*/
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
