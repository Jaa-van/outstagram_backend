const express = require("express");
const router = express.Router();

const uploadUserPhoto = require("../modules/s3_userPhoto.js");
const AuthController = require("../controllers/auth.controller");

const authController = new AuthController();

// 회원가입 기능
router.post(
  "/signup",
  uploadUserPhoto.single("userPhoto"),
  authController.signup,
);

// 회원가입 인증 이메일 발송 기능
router.post("/mail", authController.authMail);

// 로그인 기능
router.post("/login", authController.login);

//refresh token verify 기능
router.post("/rtVerify", authController.verifyRefreshToken);

module.exports = router;
