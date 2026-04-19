exports.logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.render('/index');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Logout gagal');
  }
};