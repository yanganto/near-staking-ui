import {testnet_Pools, mainnet_Pools} from "../models/mPools.js";
import pg from "pg";

const getMyPools = async (network, account_id) => {
	try {
		const pgClient = new pg.Client({
			connectionString: network === 'mainnet' ? process.env.MAINNET_POSTGRESQL_CONNECTION_STRING : process.env.TESTNET_POSTGRESQL_CONNECTION_STRING,
//			statement_timeout: 900000
		});
		await pgClient.connect();
		const pgRes = await pgClient.query(`SELECT
       ra.args -> 'args_json' ->> 'staking_pool_id' || '.' || r.receiver_account_id pool_id
FROM receipts r
         INNER JOIN execution_outcomes e ON e.receipt_id = r.receipt_id
         INNER JOIN blocks b ON b.block_hash = r.included_in_block_hash
         INNER JOIN action_receipt_actions ra ON ra.receipt_id = r.receipt_id
WHERE r.predecessor_account_id = $1
  AND e.status = 'SUCCESS_RECEIPT_ID'
  AND ra.action_kind = 'FUNCTION_CALL'
  AND ra.args ->> 'args_json'::text IS NOT NULL
  AND ra.args ->> 'method_name'::text IN ('create_staking_pool')
  AND EXISTS(
        SELECT 1
        FROM receipts r2
                 INNER JOIN execution_outcomes e2 ON e2.receipt_id = r2.receipt_id
                 INNER JOIN action_receipt_actions ra2 ON ra2.receipt_id = r2.receipt_id
        WHERE r2.originated_from_transaction_hash = r.originated_from_transaction_hash
          AND e2.status = 'SUCCESS_VALUE'
          AND r2.predecessor_account_id = r.receiver_account_id
          AND ra2.action_kind = 'FUNCTION_CALL'
          AND COALESCE(ra2.args::json ->> 'method_name', '') = 'add_staking_pool'
    )
ORDER BY b.block_timestamp DESC;`, [account_id]);
		pgClient.close;
		return pgRes.rows;
	} catch (e) {
		console.log(e);
		return [];
	}
}

export const updateMyPools = async (req, res) => {
	try {
		const myPools = await getMyPools(req.body.network, req.body.account_id);
		const Pools = req.body.network === 'mainnet' ? mainnet_Pools : testnet_Pools;
		for (const pool of myPools) {
			Pools.findOneAndUpdate({ account_id: req.body.account_id, pool_id: pool.pool_id },
				{
					account_id: req.body.account_id,
					pool_id: pool.pool_id
				}, { upsert: true }).then().catch(e => console.log(e));
		}
		res.send({ status: 'ok' });
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.send({ error: 'Please try again' });
	}
}
