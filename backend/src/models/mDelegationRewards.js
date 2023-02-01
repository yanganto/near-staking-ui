import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const schema = new Schema({
	account_id: { type: String, index: true, required: true },
	blockTimestamp: { type: mongoose.Schema.Types.Decimal128, required: true },
	date: { type: Date, index: true, required: true },
	blockHeight: { type: Number, index: true, required: true },
	pool: { type: String, index: true, required: true },
	staked: { type: String, required: true },
	unstaked: { type: String, required: true },
	withdrawn: { type: String, required: true },
	staked_balance: { type: String, required: true },
	unstaked_balance: { type: String, required: true },
	rewards: { type: mongoose.Schema.Types.Decimal128, required: true }
});

export const testnet_DelegationRewards = model('testnet_DelegationRewards', schema, 'testnet_DelegationRewards');
export const mainnet_DelegationRewards = model('mainnet_DelegationRewards', schema, 'mainnet_DelegationRewards');
