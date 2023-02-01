import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const schema = new Schema({
	blockHeight: { type: Number, index: true, required: true },
	blockTimestamp: { type: mongoose.Schema.Types.Decimal128, required: true },
	epoch_id: { type: String, required: true },
	next_epoch_id: { type: String, required: true },
	timestamp: { type: Date, required: true, index: true}
});

export const testnet_Epochs = model('testnet_Epochs', schema, 'testnet_Epochs');
export const mainnet_Epochs = model('mainnet_Epochs', schema, 'mainnet_Epochs');
