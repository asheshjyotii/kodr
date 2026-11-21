const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.send({
    success: true,
    message: "Main section",
  });
});

module.exports = router;
