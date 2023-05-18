const AuthService = require("../services/auth.service");

class AuthController {
  authService = new AuthService();

  signup = async (req, res, next) => {
    try {
      const { email, name, nickname, password } = req.body;
      const { userPhoto } = req;

      await this.authService.createUser(
        email,
        name,
        nickname,
        password,
        userPhoto,
      );

      res.status(201).json({ message: "회원가입에 성공하였습니다." });
    } catch (error) {
      error.failedApi = "회원가입";
      throw error;
    }
  };

  authMail = async (req, res, next) => {
    try {
      const { mail } = req.body;

      const authNum = Math.random().toString().substring(2, 8);

      await this.authService.sendAuthMail(mail, authNum);

      // const authMailWithNum = await this.authService.sendAuthMail(
      //   mail,
      //   authNum,
      // );
      // console.log(authMailWithNum);
      res.status(200).json({ authNum });
    } catch (error) {
      error.failedApi = "이메일 인증";
      throw error;
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

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
  verifyRefreshToken = async (req, res, next) => {
    try {
      const refreshToken = req.headers.refreshtoken;
      const userId = req.headers.userid;

      await this.authService.verifyRefreshToken(refreshToken);

      const newAccessToken = await this.authService.createAccessTokenById(
        userId,
      );
      // console.log("accessToken 을 다시 발급하였습니다!");
      res.cookie("accessToken", `Bearer ${newAccessToken}`);
      res.status(200).json({ accessToken: `Bearer ${newAccessToken}` });
    } catch (error) {
      error.failedApi = "refreshToken 검증";
      throw error;
    }
  };
}

module.exports = AuthController;
