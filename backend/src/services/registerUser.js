import { Users } from '../models/mUsers.js';
import { sendMail } from '../helpers/sendMail.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    if (!process.env.SMTP_USER)
      return res
        .status(400)
        .json({ status: 'fail', data: 'SMTP server is not configured' });
    const { first_name, last_name, email, password } = req.body;
    if (!(email && password)) {
      return res
        .status(400)
        .json({ status: 'fail', data: 'All input is required' });
    }
    const oldUser = await Users.findOne({ email });
    if (oldUser) {
      return res
        .status(409)
        .json({ status: 'fail', data: 'User Already Exist. Please Login' });
    }
    const salt = bcrypt.genSaltSync(5);
    const encryptedPassword = bcrypt.hashSync(password, salt);

    const confirmationCode = jwt.sign({ email }, process.env.JWT_TOKEN_KEY, {
      expiresIn: '1d',
    });

    await Users.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      confirmationCode,
    });

    const html =
      '<h1>' +
      process.env.SITE_URL +
      '</h1>' +
      process.env.SITE_URL +
      '/confirm/' +
      confirmationCode;

    await sendMail(email.toLowerCase(), 'confirmationCode', html);

    res.status(201).json({ status: 'success', data: 'Added' });
  } catch (err) {
    console.log(err);
  }
};
