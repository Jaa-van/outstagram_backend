const express = require("express");
const router = express.Router();
const uploadUserPhoto = require("../modules/s3_userPhoto.js");

const AuthController = require("../controllers/auth.controller");
const authController = new AuthController();

router.post("/login", authController.login);
router.post(
  "/signup",
  uploadUserPhoto.single("userPhoto"),
  authController.signup,
);
router.post("/rtVerify", authController.rtVerify);

module.exports = router;
