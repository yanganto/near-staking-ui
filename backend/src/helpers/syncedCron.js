import cron from "node-cron";
import {updateRewards} from "./updateRewards.js";

export const SyncedCron = cron.schedule('* * * * *', async () =>  {
	console.log('SyncedCron: updateRewards starts...');
	await updateRewards('testnet');
	await updateRewards('mainnet');
}, {
	scheduled: false
});
