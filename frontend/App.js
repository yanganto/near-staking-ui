import 'regenerator-runtime/runtime';
import React from 'react';

import './assets/global.css';

import {SignInPrompt, SignOutButton} from './ui/components/Wallet/ui-components';
import CreateStakingPool from "./ui/components/Staking/CreateStakingPool";


export default function App({ isSignedIn, wallet }) {
	if (!isSignedIn) {
		return <SignInPrompt onClick={ () => wallet.signIn() }/>;
	}

	return (
		<>
			<SignOutButton accountId={ wallet.accountId } onClick={ () => wallet.signOut() }/>
			<CreateStakingPool wallet={wallet}/>
		</>
	);
}
