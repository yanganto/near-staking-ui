import pg from "pg";
import nearApi from "near-api-js";


const getUnstakedBlockHeight = async (network, account_id, pool) => {
	try {
		const pgClient = new pg.Client({
			connectionString: network === 'mainnet' ? process.env.MAINNET_POSTGRESQL_CONNECTION_STRING : process.env.TESTNET_POSTGRESQL_CONNECTION_STRING,
			statement_timeout: 900000
		});
		await pgClient.connect();
		const pgRes = await pgClient.query(`SELECT b.block_height,
       b.block_timestamp,
       to_timestamp(b.block_timestamp::numeric / 1000000000),
       ra.args,
       r.predecessor_account_id                                          from_account,
       convert_from(decode(ra.args ->> 'args_base64', 'base64'), 'UTF8') args_base64,
       r.originated_from_transaction_hash                                transaction_hash,
       ra.args -> 'args_json' ->> 'amount'                               amount_transferred,
       r.receiver_account_id                                             receiver_owner_account
FROM receipts r
         INNER JOIN execution_outcomes e ON e.receipt_id = r.receipt_id
         INNER JOIN blocks b ON b.block_hash = r.included_in_block_hash
         INNER JOIN action_receipt_actions ra ON ra.receipt_id = r.receipt_id
WHERE r.predecessor_account_id = $1
  AND r.receiver_account_id = $2
  AND e.status = 'SUCCESS_VALUE'
  AND ra.action_kind = 'FUNCTION_CALL'
  AND ra.args ->> 'args_json'::text IS NOT NULL
  AND ra.args ->> 'method_name'::text IN ('unstake', 'unstake_all')
  AND b.block_timestamp >= cast(extract(epoch from now() - INTERVAL '5 DAY') as numeric(20)) * 1000000000
  AND EXISTS(
        SELECT 1
        FROM receipts r2
                 INNER JOIN execution_outcomes e2 ON e2.receipt_id = r2.receipt_id
                 INNER JOIN action_receipt_actions ra2 ON ra2.receipt_id = r2.receipt_id
        WHERE r2.originated_from_transaction_hash = r.originated_from_transaction_hash
          AND r2.predecessor_account_id = r.receiver_account_id
          AND r2.receiver_account_id LIKE r.receiver_account_id
          AND e2.status = 'SUCCESS_VALUE'
          AND ra2.action_kind = 'STAKE'
    )
  AND EXISTS(
        SELECT 1
        FROM receipts r2
                 INNER JOIN execution_outcomes e6 ON e6.receipt_id = r2.receipt_id
                 INNER JOIN action_receipt_actions ra6 ON ra6.receipt_id = r2.receipt_id
        WHERE r2.originated_from_transaction_hash = r.originated_from_transaction_hash
          AND e6.status = 'SUCCESS_VALUE'
          AND r2.predecessor_account_id = r.receiver_account_id
          AND r2.receiver_account_id = r.receiver_account_id
          AND ra6.action_kind = 'FUNCTION_CALL'
          AND ra6.args ->> 'method_name'::text = 'on_stake_action'
    )
ORDER BY b.block_timestamp DESC
LIMIT 1;`, [account_id, pool]);
		pgClient.close;
		return parseInt(pgRes.rows[0].block_height);
	} catch (e) {
		console.log(e);
		return 0;
	}
}

export const calcWithdraw = async (req, res) => {
	try {
		const NEAR_RPC_URL = req.body.network === 'mainnet' ? process.env.MAINNET_NEAR_RPC_URL : process.env.TESTNET_NEAR_RPC_URL;
		const connectionInfo = { url: NEAR_RPC_URL };
		const provider = new nearApi.providers.JsonRpcProvider(connectionInfo);
		const connection = new nearApi.Connection(NEAR_RPC_URL, provider, {});
		const unstakedBlockHeight = await getUnstakedBlockHeight(req.body.network, req.body.account_id, req.body.pool);
		if (unstakedBlockHeight > 0) {
			const account = new nearApi.Account(connection, null);
			const currentBlock = await account.connection.provider.block({ finality: 'final' });
			const last2EpochsBlock = await account.connection.provider.block({ blockId: (currentBlock.header.height - 2 * 43200) });
			const last2EpochsSeconds = (currentBlock.header.timestamp - last2EpochsBlock.header.timestamp) / 1000000000;
			const speed = 2 * 43200 / last2EpochsSeconds;
			const unstakedEpoch = await account.connection.provider.block({ blockId: unstakedBlockHeight });
			const firstBlockUnstakedEpoch = await account.connection.provider.block({ blockId: unstakedEpoch.header.next_epoch_id });
			const withdrawBlock = firstBlockUnstakedEpoch.header.height + (4 * 43200);
			const leftBlocks = withdrawBlock - currentBlock.header.height;
			const leftSeconds = Math.round(leftBlocks / speed);
			const leftHours = Math.round(leftSeconds / 60 / 60);
			const left = leftHours > 10 ? leftHours + ' Hours' : new Date(leftSeconds * 1000).toISOString().slice(11, 16);
			res.send({ status: 'Left to withdraw: ' + left });
		} else {
			res.send({ error: 'unstakedBlockHeight not found' });
		}
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.send({ error: 'Please try again' });
	}
}
