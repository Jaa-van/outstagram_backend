const AuthService = require("../services/auth.service");

class AuthController {
  authService = new AuthService();

  signup = async (req, res, next) => {
    try {
      const { email, name, nickname, password } = req.body;
      const { userPhoto } = req;
      const createId = await this.authService.createId(
        email,
        name,
        nickname,
        password,
        userPhoto,
      );

      res.status(201).json({ message: createId });
    } catch (error) {
      // 1. 미들웨어에서 error.message가 없는 경우 failedApi를 가지고 처리
      error.failedApi = "회원가입";
      throw error;
    }
  };

  authMail = async (req, res, next) => {
    try {
      const { mail } = req.body;
      let authNum = Math.random().toString().substring(2, 8);
      const authMailWithNum = await this.authService.sendAuthMail(
        mail,
        authNum,
      );
      console.log(authMailWithNum);
      res.status(200).json({ authNum: authNum });
    } catch (error) {
      error.failedApi = "이메일 인증";
      throw error;
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // 가동성을 위해 At -> accessToken, Rt -> refreshToken
      const [accessToken, userId] = await this.authService.createAccessToken(
        email,
        password,
      );
      const refreshToken = await this.authService.createRefreshToken(
        email,
        password,
      );

      res.cookie("accessToken", `Bearer ${accessToken}`);
      res.cookie("refreshToken", `Bearer ${refreshToken}`);
      res.status(200).json({
        accessToken: `Bearer ${accessToken}`,
        refreshToken: `Bearer ${refreshToken}`,
        userId,
      });
    } catch (error) {
      error.failedApi = "로그인";
      throw error;
    }
  };
  rtVerify = async (req, res, next) => {
    try {
      // 리프레시 토큰 받아오는 부분 수정
      const refreshToken = req.headers.refreshtoken;
      const userId = req.headers.userid;

      // 사용되지 않는 변수 Rt 정의 x
      await this.authService.rtVerify(refreshToken);

      const newAccessToken = await this.authService.createAccessTokenById(
        userId,
      );
      console.log("accessToken 을 다시 발급하였습니다!");
      res.cookie("accessToken", `Bearer ${newAccessToken}`);
      res.status(200).json({ accessToken: `Bearer ${newAccessToken}` });
    } catch (error) {
      error.failedApi = "refreshToken 검증";
      throw error;
    }
  };
}

module.exports = AuthController;
