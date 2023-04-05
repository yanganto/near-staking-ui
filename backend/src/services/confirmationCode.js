import { Users } from '../models/mUsers.js';

export const confirmationCode = (req, res) => {
  Users.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found' });
      }

      user.status = 'Active';
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        return res.status(200).json({ status: 'success', data: 'Activated' });
      });
    })
    .catch((e) => console.log('error', e));
};
