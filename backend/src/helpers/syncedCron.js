import cron from "node-cron";
import {updateEpochs} from "./updateEpochs.js";
import {updateDelegationRewards} from "./updateDelegationRewards.js";


let isUpdateEpochsRun = false;
cron.schedule('*/10 * * * *', async () => {
	if (!isUpdateEpochsRun) {
		console.log('CRON: isUpdateEpochsRun starts');
		isUpdateEpochsRun = true;
		await updateEpochs('testnet');
		await updateEpochs('mainnet');
		isUpdateEpochsRun = false;
	} else {
		console.log('CRON: updateEpochs is running');
	}
});

let isUpdateDelegationRewardsRun = false;
cron.schedule('* * * * *', async () => {
	if (!isUpdateDelegationRewardsRun) {
		console.log('CRON: updateRewards starts');
		isUpdateDelegationRewardsRun = true;
		await updateDelegationRewards('testnet');
		await updateDelegationRewards('mainnet');
		isUpdateDelegationRewardsRun = false;
	} else {
		console.log('CRON: updateDelegationRewards is running');
	}
});
