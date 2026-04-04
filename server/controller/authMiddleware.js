require("dotenv").config();
const express = require("express");
require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const cookies = require("cookie-parser");
const User=require("../models/User")

const authMiddleware = async(req, res, next) => {


  //token untuk role
  const token = req.cookies.token;

  // console.log(Object.keys(req)) kalau ingin mengetahui method yang ada di req
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  //jika berhasil lakukan verifikasi token//tentunya pakai try krn ini database
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    console.log("user", user);
    

      if (!user) {
      return res.status(401).json({ message: "User not found" });
      
    }
       req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

module.exports = authMiddleware;
