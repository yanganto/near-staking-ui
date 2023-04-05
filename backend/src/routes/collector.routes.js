import passport from 'passport';
import { calcWithdraw } from '../services/calcWithdraw.js';
import { getMyPools } from '../services/getMyPools.js';
import { updateMyPools } from '../services/updateMyPools.js';
import { addAccount } from '../services/addAccount.js';
import { getMyRewards } from '../services/getMyRewards.js';
import { addExistingValidator } from '../services/addExistingValidator.js';
import { registerUser } from '../services/registerUser.js';
import { loginUser } from '../services/loginUser.js';
import { orderServer } from '../services/orderServer.js';
import { confirmationCode } from '../services/confirmationCode.js';

export const routes = (app) => {
  app.post('/calc-withdraw', calcWithdraw);
  app.post('/pools/update', updateMyPools);
  app.post('/pools', getMyPools);
  app.post('/rewards', getMyRewards);
  app.post('/add-account', addAccount);
  app.post('/add-existing-validator', addExistingValidator);
  app.post('/register', registerUser);
  app.post('/login', loginUser);
  app.post(
    '/order-server',
    passport.authenticate('jwt', { session: false }),
    orderServer
  );
  app.get('/auth/confirm/:confirmationCode', confirmationCode);
};
