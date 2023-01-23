import pg from "pg";
import {mainnet_Accounts, testnet_Accounts} from "../models/mAccounts.js";
import {mainnet_Rewards, testnet_Rewards} from "../models/mRewards.js";


const getWithdrawTX = async (network, account_id, block_timestamp, length) => {
	try {
		const pgClient = new pg.Client({
			connectionString: network === 'mainnet' ? process.env.MAINNET_POSTGRESQL_CONNECTION_STRING : process.env.TESTNET_POSTGRESQL_CONNECTION_STRING,
			statement_timeout: 900000
		});
		await pgClient.connect();
		const pgRes = await pgClient.query(`SELECT to_timestamp(b.block_timestamp::numeric / 1000000000),
       b.block_timestamp,
       r.predecessor_account_id                                             account_id,
       b.block_height,
       r.originated_from_transaction_hash                                   transaction_hash,
       (SELECT ra2.args
        FROM receipts r2
                 INNER JOIN action_receipt_actions ra2 ON ra2.receipt_id = r2.receipt_id
        where ra2.action_kind = 'TRANSFER'
          AND r2.originated_from_transaction_hash = r.originated_from_transaction_hash
          AND ra2.receipt_predecessor_account_id <> 'system') ->> 'deposit' amount,
       r.receiver_account_id                                                pool_id
FROM receipts r
         INNER JOIN execution_outcomes e ON e.receipt_id = r.receipt_id
         INNER JOIN blocks b ON b.block_hash = r.included_in_block_hash
         INNER JOIN action_receipt_actions ra ON ra.receipt_id = r.receipt_id
WHERE r.predecessor_account_id = $1
  AND e.status = 'SUCCESS_VALUE'
  AND ra.action_kind = 'FUNCTION_CALL'
  AND ra.args ->> 'args_json'::text IS NOT NULL
  AND ra.args ->> 'method_name'::text IN ('withdraw', 'withdraw_all')
AND b.block_timestamp > $2
  AND EXISTS(
        SELECT 1
        FROM receipts r2
                 INNER JOIN execution_outcomes e2 ON e2.receipt_id = r2.receipt_id
                 INNER JOIN action_receipt_actions ra2 ON ra2.receipt_id = r2.receipt_id
        WHERE r2.originated_from_transaction_hash = r.originated_from_transaction_hash
          AND r2.predecessor_account_id = r.receiver_account_id
          AND r2.receiver_account_id LIKE r.predecessor_account_id
          AND e2.status = 'SUCCESS_VALUE'
          AND ra2.action_kind = 'TRANSFER'
    )
ORDER BY b.block_timestamp LIMIT $3;`, [account_id, block_timestamp, length]);
		pgClient.close;
		return pgRes.rows;
	} catch (e) {
		console.log(e);
		return [];
	}
}

export const updateRewards = async (network) => {
	const Accounts = network === 'mainnet' ? mainnet_Accounts : testnet_Accounts;
	const Rewards = network === 'mainnet' ? mainnet_Rewards : testnet_Rewards;
	const accounts = await Accounts.find({});

	for (const account of accounts) {
		let blockTimestamp = '0';
		const length = 100;
		const lastBlockTimestamp = await Rewards.findOne({ account_id: account.account_id }).sort([['block_timestamp', - 1]]);
		if (lastBlockTimestamp) blockTimestamp = lastBlockTimestamp.block_timestamp.toString();
		let transactions = await getWithdrawTX(network, account.account_id, blockTimestamp, length);
		//console.log('transactions', transactions);
		while (transactions.length > 0) {
			for (const item of transactions) {
				await Rewards.findOneAndUpdate({ transaction_hash: item.transaction_hash }, {
					account_id: item.account_id,
					pool_id: item.pool_id,
					amount: item.amount,
					transaction_hash: item.transaction_hash,
					block_height: item.block_height,
					block_timestamp: item.block_timestamp,
				}, { upsert: true }).then().catch(e => console.log(e));
			}

			let nextBlockTimestamp = transactions[transactions.length - 1].block_timestamp.toString();
			let i = 1;
			while (nextBlockTimestamp === blockTimestamp && (transactions.length === length * i)) {
				i ++;
				let increasedLength = length * i;
				transactions = await getWithdrawTX(network, account.account_id, blockTimestamp, increasedLength);
				nextBlockTimestamp = transactions[transactions.length - 1].block_timestamp.toString();
			}
			if (nextBlockTimestamp === blockTimestamp) {
				break;
			}
			if (i === 1) {
				blockTimestamp = nextBlockTimestamp;
				transactions = await getWithdrawTX(network, account.account_id, blockTimestamp, length);
			}

		}
	}
}
