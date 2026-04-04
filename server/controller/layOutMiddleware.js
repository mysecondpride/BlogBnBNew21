exports.layoutMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    res.locals.layout = "layouts/admin";
    res.locals.isAdmin = true;
  } else {
    res.locals.layout = "layouts/main";
    res.locals.isAdmin = false;
  }
  next();
};
