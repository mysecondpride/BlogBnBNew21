exports.layoutMiddleware = (req, res, next) => {
  if (req.user && ["admin", "user"].includes(req.user.role)) {
    res.locals.layout = "layouts/admin";
    res.locals.isAdmin = req.user.role === "admin";
    res.locals.isReadOnlyAdmin = req.user.role === "user";
    res.locals.currentUserRole = req.user.role;
  } else {
    res.locals.layout = "layouts/main";
    res.locals.isAdmin = false;
    res.locals.isReadOnlyAdmin = false;
    res.locals.currentUserRole = null;
  }
  next();
};
