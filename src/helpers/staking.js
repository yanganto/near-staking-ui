import {keyStores, utils} from "near-api-js";
import {nearConfig} from "./nearConfig";
import bs58 from "bs58";

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

export async function unstakeWithdraw(wallet, data) {
	const args = data.all ? {} : {
		"amount": utils.format.parseNearAmount(data.amount)
	};
	return await wallet.callMethod({
		contractId: data.pool,
		method: data.all ? data.cmd + '_all' : data.cmd,
		args,
		gas: 300000000000000
	});
}

export async function getKuutamoValidators(wallet) {
	const validatorsWithFee = [];
	const validators = await fetch(nearConfig.backendUrl + 'validators.' + nearConfig.networkId + '.json').then(response => {
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
				const canWithdraw = await wallet.viewMethod({
					contractId: account_id,
					method: "is_account_unstaked_balance_available",
					args: { account_id: wallet.accountId }
				});
				const fee = await wallet.viewMethod({ contractId: account_id, method: "get_reward_fee_fraction" });
				let data = {};
				if (!canWithdraw) {
					const requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							network: nearConfig.networkId,
							account_id: wallet.accountId,
							pool: account_id
						})
					};
					await fetch(
						nearConfig.backendUrl + "calc-withdraw", requestOptions
					).then(async response => {
						data = await response.json();
					//	console.log(data.status);
					}).catch(error => {
						console.log('There was an error!', error);
					});
				}
				myPools.push({
					account_id,
					totalBalance: utils.format.formatNearAmount(totalBalance, 2),
					stakedBalance: utils.format.formatNearAmount(stakedBalance, 2),
					unstakedBalance: utils.format.formatNearAmount(unstakedBalance, 2),
					canWithdraw,
					leftToWithdraw: data?.status,
					fee: (fee.numerator * 100) / fee.denominator
				})
			}
		} catch (error) {
			//console.log(error);
		}
	}
	return myPools;
}

export async function getMyPools(wallet) {
	let validators = {};
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			network: nearConfig.networkId,
			account_id: wallet.accountId
		})
	};
	await fetch(
		nearConfig.backendUrl + "pools", requestOptions
	).then(async response => {
		validators = await response.json();
	}).catch(error => {
		console.error('There was an error!', error);
	});

	let myPools = {};
	for (const validator of validators.myPools) {
		try {
			const fee = await wallet.viewMethod({ contractId: validator.pool_id, method: "get_reward_fee_fraction" });
			const public_key = await wallet.viewMethod({ contractId: validator.pool_id, method: "get_staking_key" });
			myPools[validator.pool_id] = {
				public_key: public_key,
				fee: (fee.numerator * 100) / fee.denominator,
				owner_id: validator.owner_id
			}
		} catch (error) {
			//console.log(error);
		}
	}

	return myPools;
}

export function toED25519(key) {
	return `${ bs58.encode(Buffer.from(key)) }`;
}

export const getSignature = async (wallet, message) => {
	const keyStore = new keyStores.BrowserLocalStorageKeyStore();
	const keyPair = await keyStore.getKey(wallet.network, wallet.accountId);
	const msg = Buffer.from(message);
	const { signature } = keyPair.sign(msg);
	return { signature: toED25519(signature), public_key: keyPair.publicKey.toString() };
};
