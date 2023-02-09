import cron from "node-cron";
import {updateEpochs} from "./updateEpochs.js";
import {updateDelegationRewards} from "./updateDelegationRewards.js";
import {updateMyPoolsCron} from "../services/updateMyPools.js";


let isUpdateEpochsRun = false;
cron.schedule('*/10 * * * *', async () => {
	if (!isUpdateEpochsRun) {
		console.log('CRON: updateEpochs starts');
		isUpdateEpochsRun = true;
		await updateEpochs('mainnet');
		await updateEpochs('testnet');
		isUpdateEpochsRun = false;
	} else {
		console.log('CRON: updateEpochs is running');
	}
});

let isUpdateDelegationRewardsRun = false;
cron.schedule('*/15 * * * *', async () => {
	if (!isUpdateDelegationRewardsRun) {
		console.log('CRON: updateDelegationRewards starts');
		isUpdateDelegationRewardsRun = true;
		await updateDelegationRewards('mainnet');
		await updateDelegationRewards('testnet');
		isUpdateDelegationRewardsRun = false;
	} else {
		console.log('CRON: updateDelegationRewards is running');
	}
});


let isUpdateMyPoolsRun = false;
cron.schedule('15 * * * *', async () => {
	if (!isUpdateMyPoolsRun) {
		console.log('CRON: updateMyPools starts');
		isUpdateMyPoolsRun = true;
		await updateMyPoolsCron('mainnet');
		await updateMyPoolsCron('testnet');
		isUpdateMyPoolsRun = false;
	} else {
		console.log('CRON: updateMyPools is running');
	}
});
