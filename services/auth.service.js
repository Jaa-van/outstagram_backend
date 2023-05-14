const AuthRepository = require("../repositories/auth.repository");
const jwt = require("jsonwebtoken");
const RedisClientRepository = require("../repositories/redishClient.repository");
require("dotenv").config();
const env = process.env;

class AuthService {
  authRepository = new AuthRepository();
  redisClientRepository = new RedisClientRepository();

  createId = async (email, name, nickname, password, userPhoto) => {
    const findByEmail = await this.authRepository.findByEmail(email);
    if (findByEmail) throw new Error("412/중복된 이메일입니다.");
    const findByNickname = await this.authRepository.findByNickname(nickname);
    if (findByNickname) throw new Error("412/중복된 닉네임입니다.");

    const signup = await this.authRepository.createId(
      email,
      name,
      nickname,
      password,
      userPhoto,
    );
    return "회원가입에 성공하였습니다.";
  };

  createAccessToken = async (email, password) => {
    const loginId = await this.authRepository.loginDb(email, password);
    if (!loginId) throw new Error("이메일 또는 패스워드를 확인해주세요.");
    const accessToken = jwt.sign(
      { userId: loginId.userId }, // JWT 데이터
      `${env.SECRET_KEY}`, // 비밀키
      { expiresIn: "2h" },
    ); // Access Token이 2시간 뒤에 만료되도록 설정합니다.
    return accessToken;
  };
  createAccessTokenById = async (userId) => {
    const accessToken = jwt.sign(
      { userId: userId }, // JWT 데이터
      `${env.SECRET_KEY}`, // 비밀키
      { expiresIn: "2h" },
    ); // Access Token이 2시간 뒤에 만료되도록 설정합니다.
    return accessToken;
  };
  createRefreshToken = async (email, password) => {
    const loginId = await this.authRepository.loginDb(email, password);
    const refreshToken = jwt.sign(
      {}, // JWT 데이터
      `${env.SECRET_KEY}`, // 비밀키
      { expiresIn: "7d" },
    ); // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
    const saveRtDb = await this.redisClientRepository.setRefreshToken(
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
    if (!findByRt)
      throw new Error("419/refreshToken의 정보가 서버에 존재하지 않습니다.");
    try {
      jwt.verify(authToken, `${env.SECRET_KEY}`); // JWT를 검증합니다.
      return true;
    } catch (error) {
      throw new Error("419/refreshToken이 유효하지 않습니다.");
    }
  };
}

module.exports = AuthService;
