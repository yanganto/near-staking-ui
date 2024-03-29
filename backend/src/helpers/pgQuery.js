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
		if (e.code === '53300')
			console.log('POSTGRESQL Error 53300: All available connection slots to the PostgreSQL database are occupied');
		else if (e.code === '40001')
			console.log('POSTGRESQL Error 40001: User query might have needed to see row versions that must be removed');
		else if (e.code === '57014')
			console.log('POSTGRESQL Error 57014: canceling statement due to statement timeout');
		else
			console.log('catch error', e);
		return false;
	}
}
