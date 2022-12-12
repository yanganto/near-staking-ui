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

export async function getKuutamoValidators(wallet) {
	const validatorsWithFee = [];
	const validators = await fetch('validators.' + nearConfig.networkId + '.json').then(response => {
		return response.json();
	}).then(data => {
		return (data);
	}).catch(err => {
		console.error("Error Reading data " + err);
	});

	for (const v of validators) {
		const fee = await wallet.viewMethod({ contractId: v.account_id, method: "get_reward_fee_fraction" });
		if (v.is_enabled) validatorsWithFee.push({
			account_id: v.account_id,
			fee: (fee.numerator * 100) / fee.denominator
		});
	}
	return (validatorsWithFee);
}

export async function getStakedValidators(wallet) {
	const result = await wallet.sendJsonRpc("validators");
	let pools = [];
	const myPools = [];
	result.current_validators.forEach((validator) => {
		pools.push(validator.account_id);
	});
	result.next_validators.forEach((validator) =>
		pools.push(validator.account_id)
	);
	result.current_proposals.forEach((validator) =>
		pools.push(validator.account_id)
	);
	pools = [...new Set(pools)]
	for (const account_id of pools) {
		try {
			const totalBalance = await wallet.viewMethod({
				contractId: account_id,
				method: "get_account_total_balance",
				args: { account_id: wallet.accountId }
			});
			const stakedBalance = await wallet.viewMethod({
				contractId: account_id,
				method: "get_account_staked_balance",
				args: { account_id: wallet.accountId }
			});
			const unstakedBalance = await wallet.viewMethod({
				contractId: account_id,
				method: "get_account_unstaked_balance",
				args: { account_id: wallet.accountId }
			});

			if (totalBalance > 0 || stakedBalance > 0 || unstakedBalance > 0) {
				const fee = await wallet.viewMethod({ contractId: account_id, method: "get_reward_fee_fraction" });
				myPools.push({ account_id,
					totalBalance: utils.format.formatNearAmount(totalBalance, 2),
					stakedBalance: utils.format.formatNearAmount(stakedBalance, 2),
					unstakedBalance: utils.format.formatNearAmount(unstakedBalance, 2),
					fee: (fee.numerator * 100) / fee.denominator })
			}
		} catch (error) {
			//console.log(error);
		}
	}
	return myPools;

}

