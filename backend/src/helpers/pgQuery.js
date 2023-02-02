import pg from "pg";

export async function pgQuery(network, queryString, queryParameters) {
	try {
		const connectionString = network === 'mainnet' ? process.env.MAINNET_POSTGRESQL_CONNECTION_STRING : process.env.TESTNET_POSTGRESQL_CONNECTION_STRING;
		const client = new pg.Client({ connectionString });
		client.on('error', function (err, client) {
			console.log('idle client error', err.message, err.stack)
		});
		await client.connect();
		const response = await client.query(queryString, queryParameters);
		await client.end();
		return response;
	} catch (e) {
		console.log('catch error', e);
		return false;
	}
}
