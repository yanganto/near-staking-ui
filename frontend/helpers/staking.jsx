import {utils} from "near-api-js";

export function generateKey(account_id) {
	const keyPair = utils.key_pair.KeyPairEd25519.fromRandom();
	return {account_id: account_id, public_key: keyPair.getPublicKey().toString(), private_key: keyPair.toString() };
}

export async function createStakingPool(wallet, poolName, ownerAccount, publicKey, percentageFee) {
	const args = {
		"staking_pool_id": poolName,
		"code_hash": process.env.contractPoolCodeHash,
		"owner_id": ownerAccount + '.' + process.env.network,
		"stake_public_key": publicKey,
		"reward_fee_fraction": { "numerator": parseInt(percentageFee), "denominator": 100 }
	};
	await wallet.callMethod({
		contractId: process.env.contractPool,
		method: 'create_staking_pool',
		args,
		gas: 300000000000000,
		deposit: utils.format.parseNearAmount("30")
	});
}
