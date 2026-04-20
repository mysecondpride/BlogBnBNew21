exports.logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.redirect('/go_to_the_dashboard');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Logout gagal');
  }
};