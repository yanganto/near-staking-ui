import {mainnet_Epochs, testnet_Epochs} from "../models/mEpochs.js";
import nearApi from "near-api-js";

const MAINNET_FIRST_EPOCH_HEIGHT = 9820210;
const TESTNET_FIRST_EPOCH_HEIGHT = 42376888;

export const bigintToDate = (timestamp) => {
	const timeInSeconds = Math.floor(timestamp / 1000000);
	return new Date(timeInSeconds);
}

export const updateEpochs = async (network) => {
	try {
		const FIRST_EPOCH_HEIGHT = network === 'mainnet' ? MAINNET_FIRST_EPOCH_HEIGHT : TESTNET_FIRST_EPOCH_HEIGHT;
		const NEAR_RPC_URL = network === 'mainnet' ? process.env.MAINNET_NEAR_ARCHIVAL_RPC_URL : process.env.TESTNET_NEAR_ARCHIVAL_RPC_URL;
		const connectionInfo = { url: NEAR_RPC_URL };
		const provider = new nearApi.providers.JsonRpcProvider(connectionInfo);
		const Epochs = network === 'mainnet' ? mainnet_Epochs : testnet_Epochs;
		const first_epoch_in_db = await Epochs.findOne({}).sort({ blockHeight: 1 });
		const finalBlock = await provider.block({ finality: 'final' });

		let prevEpoch = first_epoch_in_db?.blockHeight && first_epoch_in_db?.blockHeight !== FIRST_EPOCH_HEIGHT ?
			await provider.block({ blockId: first_epoch_in_db.next_epoch_id }) :
			await provider.block({ blockId: finalBlock.header.next_epoch_id });

		let epochs = [];
		console.log(`Update ${network} epochs:`);

		let k = 0
		while (k < 500) {
			const blockHeight = prevEpoch.header.height;
			const blockTimestamp = prevEpoch.header.timestamp_nanosec;
			const timestamp = bigintToDate(prevEpoch.header.timestamp_nanosec);
			const epoch_id = prevEpoch.header.epoch_id;
			const next_epoch_id = prevEpoch.header.next_epoch_id;

			if (await Epochs.findOne({ blockHeight })) {
				break;
			}
			epochs.push({ blockHeight, blockTimestamp, timestamp, epoch_id, next_epoch_id });
			if (Number(blockHeight) <= FIRST_EPOCH_HEIGHT) {
				break;
			}
			prevEpoch = await provider.block({ blockId: next_epoch_id });
			k ++;
		}

		for (let i = epochs.length - 1; i >= 0; i --) {
			console.log(`${ epochs[i].blockHeight } - ${ epochs[i].timestamp }`);
			Epochs.create({
				blockHeight: epochs[i].blockHeight,
				blockTimestamp: epochs[i].blockTimestamp,
				timestamp: epochs[i].timestamp,
				epoch_id: epochs[i].epoch_id,
				next_epoch_id: epochs[i].next_epoch_id,
			});
		}
		console.log(`Updated ${ epochs.length } epochs`);
	} catch (e) {
		console.log(e);
	}
}
