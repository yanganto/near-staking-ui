export const orderServer = async (req, res) => {
  try {
    return res.status(200).json({ status: 'ok', user: req.user });
  } catch (err) {
    console.log(err);
  }
};
