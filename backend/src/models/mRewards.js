import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const schema = new Schema({
	account_id: { type: String, index: true, required: true },
	pool_id: { type: String, index: true, required: true },
	amount: { type: mongoose.Schema.Types.Decimal128, required: true },
	transaction_hash: { type: String, required: true },
	block_height: {type: Number, required: true },
	block_timestamp: {type: mongoose.Schema.Types.Decimal128, index: true, required: true },
});

export const testnet_Rewards = model('testnet_Rewards', schema, 'testnet_Rewards');
export const mainnet_Rewards = model('mainnet_Rewards', schema, 'mainnet_Rewards');
