/* A helper file that simplifies using the wallet selector */

// near api js
import {connect, keyStores, providers} from 'near-api-js';

// wallet selector UI
import '@near-wallet-selector/modal-ui-js/styles.css';
import {setupModal} from '@near-wallet-selector/modal-ui-js';
import LedgerIconUrl from '@near-wallet-selector/ledger/assets/ledger-icon.png';
import MyNearIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png';

// wallet selector options
import {setupWalletSelector} from '@near-wallet-selector/core';
import {setupLedger} from '@near-wallet-selector/ledger';
import {setupMyNearWallet} from '@near-wallet-selector/my-near-wallet';
import {setupWalletConnect} from "@near-wallet-selector/wallet-connect";
import {setupNearWallet} from "@near-wallet-selector/near-wallet";
import {nearConfig} from "./nearConfig";

const THIRTY_TGAS = '30000000000000';
const NO_DEPOSIT = '0';

// Wallet that simplifies using the wallet selector
export class Wallet {
	walletSelector;
	wallet;
	network;
	createAccessKeyFor;

	constructor({ createAccessKeyFor = undefined, network = 'testnet' }) {
		// Login to a wallet passing a contractId will create a local
		// key, so the user skips signing non-payable transactions.
		// Omitting the accountId will result in the user being
		// asked to sign all transactions.
		this.createAccessKeyFor = createAccessKeyFor
		this.network = network
	}

	// To be called when the website loads
	async startUp() {
		this.walletSelector = await setupWalletSelector({
			network: this.network,
			modules: [setupMyNearWallet({ iconUrl: MyNearIconUrl }),
				setupLedger({ iconUrl: LedgerIconUrl }),
				setupNearWallet(),
				setupWalletConnect({
					projectId: nearConfig.walletConnectProjectId,
					metadata: {
						name: "kuutamo",
						description: "Connect with WalletConnect",
						url: window.location.origin,
						icons: [window.location.origin + "/favicon.ico"],
					},
				}),
			],
		});

		const isSignedIn = this.walletSelector.isSignedIn();

		this.walletSelector.on("signedIn", () => {
			window.location.replace(window.location.origin + window.location.pathname);
		});
		this.walletSelector.on("signedOut", () => {
			window.location.replace(window.location.origin + window.location.pathname);
		});

		if (isSignedIn) {
			this.wallet = await this.walletSelector.wallet();
			this.accountId = this.walletSelector.store.getState().accounts[0].accountId;
		}

		return isSignedIn;
	}

	// Sign-in method
	signIn() {
		const description = 'Please select a wallet to sign in.';
		const modal = setupModal(this.walletSelector, {contractId: this.createAccessKeyFor, description });
		modal.show();
	}

	// Sign-out method
	signOut() {
		this.wallet.signOut();
	}

	// Make a read-only call to retrieve information from the network
	async viewMethod({ contractId, method, args = {} }) {
		const { network } = this.walletSelector.options;
		const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

		let res = await provider.query({
			request_type: 'call_function',
			account_id: contractId,
			method_name: method,
			args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
			finality: 'optimistic',
		});
		return JSON.parse(Buffer.from(res.result).toString());
	}

	// Call a method that changes the contract's state
	async callMethod({ contractId, method, args = {}, gas = THIRTY_TGAS, deposit = NO_DEPOSIT }) {
		// Sign a transaction with the "FunctionCall" action
		return await this.wallet.signAndSendTransaction({
			signerId: this.accountId,
			receiverId: contractId,
			actions: [
				{
					type: 'FunctionCall',
					params: {
						methodName: method,
						args,
						gas,
						deposit,
					},
				},
			],
		});
	}

	async getAccountBalance(account_id) {
		const { network } = this.walletSelector.options;
		const nearConnection = await connect({ ...network, keyStore: new keyStores.BrowserLocalStorageKeyStore() });
		const account = await nearConnection.account(account_id);
		return await account.getAccountBalance();
	}

	async accountExists(account_id) {
		const { network } = this.walletSelector.options;
		const nearConnection = await connect({ ...network, keyStore: new keyStores.BrowserLocalStorageKeyStore() });
		try {
			const account = await nearConnection.account(account_id);
			await account.state();
			return true;
		} catch (error) {
			return false;
		}
	}

	async sendJsonRpc(cmd) {
		const { network } = this.walletSelector.options;
		const nearConnection = await connect({ ...network, keyStore: new keyStores.BrowserLocalStorageKeyStore() });
		const account = await nearConnection.account(this.wallet.accountId);
		return await account.connection.provider.sendJsonRpc(cmd, [null]);
	}

	// Get transaction result from the network
	async getTransactionResult(txhash) {
		const { network } = this.walletSelector.options;
		const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

		// Retrieve transaction result from the network
		const transaction = await provider.txStatus(txhash, 'unnused');
		return providers.getTransactionLastResult(transaction);
	}

}
