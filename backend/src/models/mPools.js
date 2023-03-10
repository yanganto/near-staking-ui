import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const schema = new Schema({
	account_id: { type: String, index: true, required: true },
	pool_id: { type: String, index: true, required: true },
	owner_id: { type: String, index: true, required: true },
});

export const testnet_Pools = model('testnet_Pools', schema, 'testnet_Pools');
export const mainnet_Pools = model('mainnet_Pools', schema, 'mainnet_Pools');
