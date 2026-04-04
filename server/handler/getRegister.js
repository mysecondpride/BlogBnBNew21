const express = require("express");

exports.getRegister = (req, res) => {
  try {
    // isi logic di sini
    res.render("admin/index");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Terjadi kesalahan server");
  }
};
