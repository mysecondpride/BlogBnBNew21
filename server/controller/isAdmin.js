const express = require("express");

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Akses ditolak, anda bukan admin");
  }
  next(); // lanjut ke controller page
};
