// 내장 모듈 불러오기 (최상단)
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

require("dotenv").config();
const env = process.env;
var appDir = path.dirname(require.main.filename);

// 우리가 만든 모듈 불러오기 (최하단)
const UsersRepository = require("../repositories/users.repository");
const RedisClientRepository = require("../repositories/redisClient.repository");

const { Users } = require("../models");

class AuthService {
  usersRepository = new UsersRepository(Users);
  redisClientRepository = new RedisClientRepository();

  createUser = async (email, name, nickname, password, userPhoto) => {
    const userByEmail = await this.usersRepository.findUserByEmail(email);
    if (userByEmail) {
      throw new Error("412/중복된 이메일입니다.");
    }

    const userByNickname = await this.usersRepository.findUserByNickname(
      nickname,
    );
    if (userByNickname) {
      throw new Error("412/중복된 닉네임입니다.");
    }

    await this.usersRepository.createUser(
      email,
      name,
      nickname,
      password,
      userPhoto,
    );
  };

  sendAuthMail = async (mail, authNum) => {
    // emailTemplete -> emailTemplate 오타 수정
    let emailTemplate;

    ejs.renderFile(
      appDir + "/template/authMail.ejs",
      { authCode: authNum },
      function (error, data) {
        if (error) {
          console.error(error);
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
    const user = await this.usersRepository.findUserByEmailAndPassword(
      email,
      password,
    );
    if (!user) {
      throw new Error("412/이메일 또는 패스워드를 확인해주세요.");
    }

    return [
      jwt.sign({ userId: user.userId }, `${env.SECRET_KEY}`, {
        expiresIn: "2h",
      }),
      user.userId,
    ];
  };

  createRefreshToken = async (email, password) => {
    const user = await this.usersRepository.findUserByEmailAndPassword(
      email,
      password,
    );

    const refreshToken = jwt.sign({}, `${env.SECRET_KEY}`, { expiresIn: "7d" });

    await this.redisClientRepository.setRefreshToken(refreshToken, user.userId);

    return refreshToken;
  };

  createAccessTokenById = async (userId) => {
    return jwt.sign({ userId: userId }, `${env.SECRET_KEY}`, {
      expiresIn: "2h",
    });
  };

  verifyRefreshToken = async (refreshToken) => {
    const [authType, authToken] = (refreshToken ?? "").split(" ");

    if (authType !== "Bearer" || !authToken) {
      throw new Error("419/refreshToken의 형식이 일치하지 않습니다.");
    }

    const refreshTokenInfo = await this.redisClientRepository.getRefreshToken(
      authToken,
    );
    if (!refreshTokenInfo) {
      throw new Error("419/refreshToken의 정보가 서버에 존재하지 않습니다.");
    }

    try {
      jwt.verify(authToken, `${env.SECRET_KEY}`);

      return true;
    } catch (error) {
      throw new Error("419/refreshToken이 유효하지 않습니다.");
    }
  };
}

module.exports = AuthService;
