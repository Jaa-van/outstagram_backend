const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require("dotenv").config();
const env = process.env;

module.exports = async (req, res, next) => {
  const { accessToken } = req.cookies;
  // access token 이 존재하지 않는 경우 로그인 페이지로 이동
  if (!accessToken) throw new Error("400/Access Token 이 존재하지 않습니다.");

  const [authType, AT] = (accessToken ?? "").split(" ");
  if (authType !== "Bearer" || !AT) {
    res
      .status(403)
      .json({ errorMessage: "419/Access Token이 유효하지 않습니다." });
    return;
  }

  const userId = validateAccessToken(AT);
  if (!userId) throw new Error("403/Access Token이 만료되었습니다.");

  const user = await Users.findOne({
    where: { userId: userId },
  });
  res.locals.user = user;
  console.log(`${userId}의 Payload 를 가진 Token이 성공적으로 인증되었습니다.`);
  next();
};

function validateAccessToken(accessToken) {
  try {
    const { userId } = jwt.verify(accessToken, `${env.SECRET_KEY}`); // JWT를 검증합니다.
    return userId;
  } catch (error) {
    return false;
  }
}
