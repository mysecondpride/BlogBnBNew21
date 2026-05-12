const express = require("express");

exports.isAdmin = (req, res, next) => {
  console.log(req.user.role, "iki role e");

  if (req.user.role !== "admin") {
    return res.status(403).send("Akses ditolak, anda bukan admin");
  }
  next(); // lanjut ke controller page
};

exports.canAccessAdminDashboard = (req, res, next) => {
  const allowedRoles = ["admin", "user"];

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).send("Akses ditolak");
  }

  next();
};
