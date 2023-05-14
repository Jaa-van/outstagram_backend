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
      throw new Error(error.message || "400/회원가입에 실패하였습니다.");
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
      throw new Error(
        error.message || "400/알수없는 이유로 오류가 발생하였습니다.",
      );
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const At = await this.authService.createAccessToken(email, password);
      const Rt = await this.authService.createRefreshToken(email, password);

      res.cookie("accessToken", `Bearer ${At}`);
      res.cookie("refreshToken", `Bearer ${Rt}`);
      res.status(200).json({ accessToken: At, refreshToken: Rt });
    } catch (error) {
      throw new Error(error.message || "400/로그인에 실패하였습니다.");
    }
  };
  rtVerify = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const { userId } = req.body;

      const Rt = await this.authService.rtVerify(refreshToken);
      const newAt = await this.authService.createAccessTokenById(userId);
      console.log("accessToken 을 다시 발급하였습니다!");
      res.cookie("accessToken", `Bearer ${newAt}`);
      res.status(200).json({ accessToken: newAt });
    } catch (error) {
      throw new Error(
        error.message || "400/refreshToken 검증에 실패하였습니다.",
      );
    }
  };
}

module.exports = AuthController;
