import {utils} from "near-api-js";
import {nearConfig} from "./nearConfig";

export function generateKey(account_id) {
	const keyPair = utils.key_pair.KeyPairEd25519.fromRandom();
	return { account_id: account_id, public_key: keyPair.getPublicKey().toString(), private_key: keyPair.toString() };
}

export async function createStakingPool(wallet, contractPool, poolName, ownerAccount, publicKey, percentageFee) {
	const args = contractPool === 2 ? {
		"staking_pool_id": poolName,
		"code_hash": nearConfig.poolCodeHash,
		"owner_id": ownerAccount,
		"stake_public_key": publicKey,
		"reward_fee_fraction": { "numerator": parseInt(percentageFee), "denominator": 100 }
	} : {
		"staking_pool_id": poolName,
		"owner_id": ownerAccount,
		"stake_public_key": publicKey,
		"reward_fee_fraction": { "numerator": parseInt(percentageFee), "denominator": 100 }
	};

	return await wallet.callMethod({
		contractId: contractPool === 2 ? nearConfig.contractPool : nearConfig.contractPoolV1,
		method: 'create_staking_pool',
		args,
		gas: 300000000000000,
		deposit: utils.format.parseNearAmount("30")
	});
}

export async function stakeToKuutamoPool(wallet, poolName, amount) {
	return await wallet.callMethod({
		contractId: poolName,
		method: 'deposit_and_stake',
		args: {},
		gas: 300000000000000,
		deposit: utils.format.parseNearAmount(amount)
	});
}
