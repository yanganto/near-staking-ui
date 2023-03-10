import {calcWithdraw} from "../services/calcWithdraw.js";
import {getMyPools} from "../services/getMyPools.js";
import {updateMyPools} from "../services/updateMyPools.js";
import {addAccount} from "../services/addAccount.js";
import {getMyRewards} from "../services/getMyRewards.js";
import {addExistingValidator} from "../services/addExistingValidator.js";


export const routes = app => {
	app.post('/calc-withdraw', calcWithdraw);
	app.post('/pools/update', updateMyPools);
	app.post('/pools', getMyPools);
	app.post('/rewards', getMyRewards);
	app.post('/add-account', addAccount);
	app.post('/add-existing-validator', addExistingValidator);
}
