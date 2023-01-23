import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const schema = new Schema({
	account_id: { type: String, index: true, required: true },
});

export const testnet_Accounts = model('testnet_Accounts', schema, 'testnet_Accounts');
export const mainnet_Accounts = model('mainnet_Accounts', schema, 'mainnet_Accounts');
