import { Users } from '../models/mUsers.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send({ status: 'fail', message: 'Bad Request' });
    }
    const user = await Users.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.status !== 'Active')
        return res
          .status(400)
          .send({ status: 'fail', message: 'user status is ' + user.status });

      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_TOKEN_KEY,
        {
          expiresIn: '1h',
        }
      );
      return res
        .status(200)
        .json({ status: 'success', data: { user_id: user._id, token } });
    }
    return res.status(400).send({ status: 'fail', message: 'Bad Request' });
  } catch (err) {
    console.log(err);
  }
};
