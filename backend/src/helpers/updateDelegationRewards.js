import pg from "pg";
import nearApi from "near-api-js";
import {mainnet_Epochs, testnet_Epochs} from "../models/mEpochs.js";
import {mainnet_Accounts, testnet_Accounts} from "../models/mAccounts.js";
import {mainnet_DelegationRewards, testnet_DelegationRewards} from "../models/mDelegationRewards.js";
import Decimal from "decimal.js";
import fs from "node:fs";


const TESTNET_FIRST_EPOCH_HEIGHT = 42376888;
const MAINNET_FIRST_EPOCH_HEIGHT = 9820210;
const yoctoNEAR = new Decimal(1000000000000000000000000);
const maxRewardRate = new Decimal('0.14').div(365).mul(10).toFixed(8);

const getEpochTransactions = async (network, prevBlock, Block, account_id, pool) => {
	const pgClient = new pg.Client({
		connectionString: network === 'mainnet' ? process.env.MAINNET_POSTGRESQL_CONNECTION_STRING : process.env.TESTNET_POSTGRESQL_CONNECTION_STRING,
		statement_timeout: 900000
	});
	await pgClient.connect();
	const pgRes = await pgClient.query(`SELECT a.transaction_hash,
              b.block_timestamp,
              b.block_height,
              r.receiver_account_id,
              r.receiver_account_id     receipt_receiver_account_id,
              r.predecessor_account_id,
              ra.args ->> 'method_name' method_name,
              ra.args ->> 'deposit'     deposit,
              ra.args ->> 'args_base64' args_base64,
              ra.args,
              a.args ->> 'method_name' method_name2
       FROM receipts r,
            blocks b,
            transaction_actions a,
            action_receipt_actions ra,
            execution_outcomes e
       WHERE a.transaction_hash = r.originated_from_transaction_hash
         AND r.receipt_id = e.receipt_id
         AND b.block_timestamp = r.included_in_block_timestamp
         AND ra.receipt_id = r.receipt_id
         AND a.action_kind = 'FUNCTION_CALL'
         AND e.status = 'SUCCESS_VALUE'
         AND r.predecessor_account_id != 'system'
         AND b.block_height >= $3 AND b.block_height < $4
         AND ra.args ->> 'method_name' IN
             ('deposit', 'deposit_and_stake', 'withdraw_all', 'withdraw', 'stake', 'unstake', 'unstake_all')
         AND r.predecessor_account_id = $1 AND r.receiver_account_id = $2
       ORDER BY b.block_timestamp`, [account_id, pool, prevBlock, Block]);
	await pgClient.end();
	return pgRes.rows;
}

const getPrevEpochBlock = async (network, account_id, pool) => {
	const Epochs = network === 'mainnet' ? mainnet_Epochs : testnet_Epochs;
	const DelegationRewards = network === 'mainnet' ? mainnet_DelegationRewards : testnet_DelegationRewards;
	const lastUpdatedEpoch = await DelegationRewards.findOne({ account_id: account_id, pool }).sort({ date: - 1 });
	if (lastUpdatedEpoch) {
		const epoch = await Epochs.findOne({ blockHeight: lastUpdatedEpoch.blockHeight });
		return { blockHeight: epoch.blockHeight, blockTimestamp: epoch.blockTimestamp };
	} else return { blockHeight: 0, blockTimestamp: 0 };
}

const getNextEpochBlock = async (network, account_id, pool) => {
	const Epochs = network === 'mainnet' ? mainnet_Epochs : testnet_Epochs;
	const DelegationRewards = network === 'mainnet' ? mainnet_DelegationRewards : testnet_DelegationRewards;
	const lastUpdatedEpoch = await DelegationRewards.findOne({ account_id: account_id, pool }).sort({ date: - 1 });
	if (lastUpdatedEpoch) {
		const epoch = await Epochs.findOne({ blockTimestamp: { $gt: lastUpdatedEpoch.blockTimestamp } }).sort({ blockHeight: 1 });
		return { blockHeight: epoch?.blockHeight, blockTimestamp: epoch?.blockTimestamp };
	}

	const pgClient = new pg.Client({
		connectionString: network === 'mainnet' ? process.env.MAINNET_POSTGRESQL_CONNECTION_STRING : process.env.TESTNET_POSTGRESQL_CONNECTION_STRING,
		statement_timeout: 900000
	});
	await pgClient.connect();
	const pgRes = await pgClient.query(`SELECT
				to_char(to_timestamp(block_timestamp::numeric / 1000000000), 'yyyy-mm-dd') as date
        FROM receipts r,
             blocks b
        WHERE b.block_timestamp = r.included_in_block_timestamp
          AND r.predecessor_account_id = $1
          AND r.receiver_account_id = $2
        ORDER BY b.block_timestamp
        limit 1;`, [account_id, pool]);
	await pgClient.end();
	const epoch = await Epochs.findOne({ timestamp: { $gt: pgRes.rows[0]?.date } }).sort({ blockHeight: 1 });
	return { blockHeight: epoch?.blockHeight, blockTimestamp: epoch?.blockTimestamp };
}

const getKuutamoPools = async (network) => {
	if (network !== 'testnet' && network !== 'mainnet') return [];
	try {
		const data = JSON.parse(fs.readFileSync('./public/validators.' + network + '.json', 'utf8'));
		const pools = [];
		for (let i in data) {
			if (data[i].is_enabled) pools.push(data[i].account_id);
		}
		return pools;
	} catch (err) {
		console.error(err);
	}
}

const calculateRewards = async (
	network,
	prevBlockHeight,
	blockHeight,
	accountId,
	pool,
	stakedBalance,
	unStakedBalance,
	transactionInfo,
	ownerId
) => {
	const FIRST_EPOCH_HEIGHT = network === 'mainnet' ? MAINNET_FIRST_EPOCH_HEIGHT : TESTNET_FIRST_EPOCH_HEIGHT;
	const DelegationRewards = network === 'mainnet' ? mainnet_DelegationRewards : testnet_DelegationRewards;
	let stakedBalanceNear = new Decimal(stakedBalance).div(yoctoNEAR).toFixed(2);
	let unStakedBalanceNear = new Decimal(unStakedBalance).div(yoctoNEAR).toFixed(2);

	let stakedBalancePrev = new Decimal(0).toFixed(0);
	let unStakedBalancePrev = new Decimal(0).toFixed(0);
	let isFirstEpoch = true;

	let delegatorPrevEpoch = await DelegationRewards.findOne(
		{ account_id: accountId, pool: pool, blockHeight: prevBlockHeight }
	);

	if (delegatorPrevEpoch) {
		stakedBalancePrev = new Decimal(delegatorPrevEpoch.staked_balance).div(yoctoNEAR).toFixed(2);
		unStakedBalancePrev = new Decimal(delegatorPrevEpoch.unstaked_balance).div(yoctoNEAR).toFixed(2);
		isFirstEpoch = false;
	}

	let staked = new Decimal(0).toFixed(2);
	let unStaked = new Decimal(0).toFixed(2);
	let withdrawn = new Decimal(0).toFixed(2);
	let isAllUnStaked = false;
	let isUnStaked = false;
	let isWithdrawn = false;

	if (transactionInfo && transactionInfo.length > 0) {
		transactionInfo.map((i) => {
			i.args = /^\[.+]$/.test(i.args_base64) ?
				String.fromCharCode.apply(null, JSON.parse(i.args_base64)) :
				(i.args_base64 ? Buffer.from(i.args_base64, 'base64').toString('utf-8') : '{}')
			let amountNear = Number(i.deposit);
			if (amountNear === 0 && i.args) {
				let args = typeof i.args === 'object' ? i.args : JSON.parse(i.args);
				amountNear = args.amount ? args.amount : 0;
			}
			const amount = new Decimal(amountNear).div(yoctoNEAR).toFixed(6);
			if (i.method_name === 'deposit_and_stake' || i.method_name === 'deposit' || i.method_name === 'stake') {
				staked = new Decimal(staked).plus(amount).toFixed(2);
			}
			if (i.method_name === 'unstake') {
				unStaked = new Decimal(unStaked).plus(amount).toFixed(2);
				isUnStaked = true;
			}
			if (i.method_name === 'unstake_all') {
				unStaked = new Decimal(unStaked).plus(unStakedBalanceNear).minus(unStakedBalancePrev).toFixed(2);
				isAllUnStaked = true;
			}
			if (i.method_name === 'withdraw') {
				withdrawn = new Decimal(withdrawn).plus(amount).toFixed(2);
				isWithdrawn = true;
			}
			if (i.method_name === 'withdraw_all') {
				withdrawn = new Decimal(withdrawn).plus(unStakedBalancePrev).toFixed(2);
				isWithdrawn = true;
			}
		});
	}

	if (isAllUnStaked && (isWithdrawn || isUnStaked)) {
		unStaked = new Decimal(unStakedBalanceNear).minus(unStakedBalancePrev).plus(withdrawn).toFixed(2);
	}

	// Transactions not found
	// un-stake or un-stake_all
	if (!isUnStaked && !isAllUnStaked && new Decimal(unStakedBalanceNear).plus(withdrawn)
		.greaterThan(new Decimal(unStakedBalancePrev)) && blockHeight > FIRST_EPOCH_HEIGHT) {
		unStaked = new Decimal(unStakedBalanceNear).plus(withdrawn).minus(new Decimal(unStakedBalancePrev)).toFixed(2);
	}
	// withdraw or withdraw_all
	if (!isWithdrawn && new Decimal(unStakedBalanceNear).minus(unStaked)
		.lessThan(new Decimal(unStakedBalancePrev)) && blockHeight > FIRST_EPOCH_HEIGHT) {
		withdrawn = new Decimal(unStakedBalancePrev).minus(unStakedBalanceNear).plus(unStaked).toFixed(2);
	}
	// deposit_and_stake or deposit or stake
	let maxRewards = new Decimal(stakedBalanceNear).minus(staked).plus(unStaked).mul(maxRewardRate).toFixed(2);
	// TODO: While the aurora.pool.near returns an error when executing get_owner_id method
	if (new Decimal(stakedBalanceNear).minus(staked).plus(unStaked).minus(stakedBalancePrev)
			.greaterThan(new Decimal(maxRewards)) && blockHeight > FIRST_EPOCH_HEIGHT && accountId !== ownerId &&
		pool !== "aurora.pool.near") {
		staked = new Decimal(staked).plus(new Decimal(stakedBalanceNear).minus(staked).plus(unStaked)
			.minus(stakedBalancePrev)).toFixed(2);
	}

	let rewards = new Decimal(stakedBalanceNear).minus(stakedBalancePrev).minus(staked).plus(unStaked).toFixed(2);
	if (isFirstEpoch) {
		rewards = new Decimal(0).toFixed(2);
	} else {
		rewards = removeLeftDash(rewards);
	}

	return { rewards, staked, unStaked, withdrawn };
}
const removeLeftDash = (amountStr) => {
	return amountStr.substring(0, 1) === '-' ? amountStr.replace(/-/g, '') : amountStr;
}

export const updateDelegationRewards = async (network) => {
	try {
		const Epochs = network === 'mainnet' ? mainnet_Epochs : testnet_Epochs;
		const Accounts = network === 'mainnet' ? mainnet_Accounts : testnet_Accounts;
		const DelegationRewards = network === 'mainnet' ? mainnet_DelegationRewards : testnet_DelegationRewards;
		const accounts = await Accounts.find({});
		const pools = await getKuutamoPools(network);
		for (const pool of pools) {
			const ownerId = await getOwnerId(network, pool, null);
			for (const account of accounts) {
				const account_id = account.account_id;
				let block = await getNextEpochBlock(network, account_id, pool);
				let prevBlock = await getPrevEpochBlock(network, account_id, pool);
				const LastEpoch = await Epochs.findOne({}).sort({ blockHeight: - 1 });

				while (block.blockHeight <= LastEpoch.blockHeight) {
					const account_balance = await getStakedBalance(network, account_id, pool, block.blockHeight);
					const transactionInfo = await getEpochTransactions(network, prevBlock.blockHeight, block.blockHeight, account_id, pool);
					const r = await calculateRewards(network, prevBlock.blockHeight, block.blockHeight, account_id, pool, account_balance.staked_balance, account_balance.unstaked_balance, transactionInfo, ownerId);

					await DelegationRewards.findOneAndUpdate({ account_id, blockHeight: block.blockHeight, pool },
						{
							account_id,
							blockTimestamp: block.blockTimestamp,
							date: bigintToDate(block.blockTimestamp),
							blockHeight: block.blockHeight,
							pool,
							staked: r.staked,
							unstaked: r.unStaked,
							withdrawn: r.withdrawn,
							staked_balance: account_balance.staked_balance,
							unstaked_balance: account_balance.unstaked_balance,
							rewards: r.rewards
						}, { upsert: true }).then().catch(e => console.log(e));
					block = await getNextEpochBlock(network, account_id, pool);
					prevBlock = await getPrevEpochBlock(network, account_id, pool);
				}
			}
		}
		console.log(network, 'updateDelegationRewards END');
		return [];

	} catch (e) {
		console.log(e);
		return [];
	}
}

async function providerQuery(network, requestType, accountId, methodName, args, blockId, defaultValue) {
	try {
		const NEAR_RPC_URL = network === 'mainnet' ? process.env.MAINNET_NEAR_ARCHIVAL_RPC_URL : process.env.TESTNET_NEAR_ARCHIVAL_RPC_URL;
		const connectionInfo = { url: NEAR_RPC_URL };
		const provider = new nearApi.providers.JsonRpcProvider(connectionInfo);

		const rawResult = blockId ? await provider.query({
			request_type: requestType,
			account_id: accountId,
			method_name: methodName,
			args_base64: args,
			block_id: blockId,
		}) : await provider.query({
			request_type: requestType,
			account_id: accountId,
			method_name: methodName,
			args_base64: args,
			finality: "final",
		});
		return JSON.parse(Buffer.from(rawResult.result).toString());

	} catch (e) {
		// TODO: Not fatal exceptions
		if (e.type === "AccountDoesNotExist" ||
			e.type === "UntypedError" && e.message.includes("FunctionCallError(HostError(ProhibitedInView") ||
			e.type === "HANDLER_ERROR" && e.message.includes("does not exist while viewing")
		) {
			return JSON.parse(defaultValue);
		}
		console.log(e.type);
		throw new Error(e.message);
	}
}

async function getStakedBalance(network, accountId, pool, blockId) {
	try {
		const accountBalance = await providerQuery(
			network,
			"call_function",
			pool,
			"get_account",
			Buffer.from(`{"account_id": "${ accountId }"}`).toString('base64'),
			blockId,
			'{ "unstaked_balance": 0, "staked_balance": 0 }'
		);
		return accountBalance;
	} catch (e) {
		console.log(e);
		return false;
	}
}

async function getOwnerId(network, pool, blockId) {
	try {
		const accountBalance = await providerQuery(
			network,
			"call_function",
			pool,
			"get_owner_id",
			Buffer.from(`{"AccountId": "${ pool }"}`).toString('base64'),
			blockId,
			'{}'
		);
		return accountBalance;
	} catch (e) {
		console.log(e);
		return false;
	}
}

const bigintToDate = (timestamp) => {
	const timeInSeconds = Math.floor(timestamp / 1000000);
	return new Date(timeInSeconds);
}