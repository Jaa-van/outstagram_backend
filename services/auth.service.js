// 내장 모듈 불러오기 (최상단)
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

require("dotenv").config();
const env = process.env;
var appDir = path.dirname(require.main.filename);

// 우리가 만든 모듈 불러오기 (최하단)
const AuthRepository = require("../repositories/auth.repository");
const RedisClientRepository = require("../repositories/redisClient.repository");

const { Users } = require("../models");

class AuthService {
  authRepository = new AuthRepository(Users);
  redisClientRepository = new RedisClientRepository();

  createId = async (email, name, nickname, password, userPhoto) => {
    const findByEmail = await this.authRepository.findByEmail(email);
    if (findByEmail) {
      throw new Error("412/중복된 이메일입니다.");
    }

    const findByNickname = await this.authRepository.findByNickname(nickname);

    if (findByNickname) {
      throw new Error("412/중복된 닉네임입니다.");
    }

    // 사용하지 않는 signup 변수 정의 x
    await this.authRepository.createId(
      email,
      name,
      nickname,
      password,
      userPhoto,
    );
    return "회원가입에 성공하였습니다.";
  };

  sendAuthMail = async (mail, authNum) => {
    // emailTemplete -> emailTemplate 오타 수정
    let emailTemplate;

    ejs.renderFile(
      appDir + "/template/authMail.ejs",
      { authCode: authNum },
      function (error, data) {
        if (error) {
          console.log(error);
        }
        emailTemplate = data;
      },
    );

    let transporter = nodemailer.createTransport({
      service: "naver",
      host: "smtp.naver.com",
      port: 465,
      secure: false,
      auth: {
        // process.env 대신 위에서 불러온 env 사용
        user: env.NODEMAILER_USER,
        pass: env.NODEMAILER_PASS,
      },
    });

    let mailOptions = await transporter.sendMail({
      from: `finestecher <${env.NODEMAILER_USER}>`,
      to: mail,
      subject: "회원가입을 위한 인증번호를 입력해주세요.",
      html: emailTemplate,
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
      }

      console.log("Finish sending email");
      transporter.close();
    });

    return "Sending email complete";
  };

  createAccessToken = async (email, password) => {
    const loginId = await this.authRepository.loginDb(email, password);
    if (!loginId) {
      throw new Error("412/이메일 또는 패스워드를 확인해주세요.");
    }

    // 변수 선언 대신에 jwt.sign 바로 return
    return jwt.sign(
      { userId: loginId.userId }, // JWT 데이터
      `${env.SECRET_KEY}`, // 비밀키
      { expiresIn: "2h" },
    ); // Access Token이 2시간 뒤에 만료되도록 설정합니다.
  };

  createAccessTokenById = async (userId) => {
    return jwt.sign(
      { userId: userId }, // JWT 데이터
      `${env.SECRET_KEY}`, // 비밀키
      { expiresIn: "2h" },
    ); // Access Token이 2시간 뒤에 만료되도록 설정합니다.
  };

  createRefreshToken = async (email, password) => {
    const loginId = await this.authRepository.loginDb(email, password);

    const refreshToken = jwt.sign(
      {}, // JWT 데이터
      `${env.SECRET_KEY}`, // 비밀키
      { expiresIn: "7d" },
    ); // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
    // 사용하지 않는 saveRtDb 정의 x

    await this.redisClientRepository.setRefreshToken(
      refreshToken,
      loginId.userId,
    );
    return refreshToken;
  };

  rtVerify = async (refreshToken) => {
    const [authType, authToken] = (refreshToken ?? "").split(" ");

    // Bearer 와 로그인을 안한 것에 대한 검사
    if (authType !== "Bearer" || !authToken) {
      throw new Error("419/refreshToken의 형식이 일치하지 않습니다.");
    }

    const findByRt = await this.redisClientRepository.getRefreshToken(
      authToken,
    );

    if (!findByRt) {
      throw new Error("419/refreshToken의 정보가 서버에 존재하지 않습니다.");
    }

    try {
      // TODO: 고민
      jwt.verify(authToken, `${env.SECRET_KEY}`); // JWT를 검증합니다.

      return true;
    } catch (error) {
      throw new Error("419/refreshToken이 유효하지 않습니다.");
    }
  };
}

module.exports = AuthService;
