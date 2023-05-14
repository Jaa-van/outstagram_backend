const jwt = require("jsonwebtoken");
const { users } = require("../models");
const redis = require("redis");
require("dotenv").config();
const RedisClientRepository = require("../repositories/redishClient.repository");
const env = process.env;

module.exports = async (req, res, next) => {
  const redisClientRepository = new RedisClientRepository();
  const { accessToken, refreshToken } = req.cookies;

  if (!refreshToken) throw new Error("400/Refresh Token 이 존재하지 않습니다.");
  if (!accessToken) throw new Error("400/Access Token 이 존재하지 않습니다.");

  const [authTypeAt, AT] = (accessToken ?? "").split(" ");
  const [authTypeRt, RT] = (refreshToken ?? "").split(" ");

  const AtValidate = validateAccessToken(accessToken);
  const RtValidate = validateRefreshToken(refreshToken);

  let newAccessToken;

  if (!RtValidate) throw new Error("419/refresh Token 이 유효하지 않습니다.");

  if (!AtValidate) {
    const accessTokenId = await redisClientRepository.getRefreshToken(
      refreshToken,
    );
    console.log(accessTokenId);

    if (!accessTokenId)
      throw new Error("419/refresh Token의 정보가 서버에 존재하지 않습니다");

    const newAt = jwt.sign({ userId: accessTokenId }, `${env.SECRET_KEY}`, {
      expiresIn: "10s",
    });
    res.cookie("accessToken", newAt);
    newAccessToken = newAt;
    console.log("access token을 다시 발급하였습니다.!");
  }
  let userId;
  if (newAccessToken) {
    userId = getAccessTokenPayload(newAccessToken).userId;
  } else {
    userId = AtValidate.userId;
  }
  const user = await users.findOne({
    where: { userId: userId },
  });
  console.log(user);
  res.locals.user = user;
  console.log(`${userId}의 Payload 를 가진 Token이 성공적으로 인증되었습니다.`);
  next();
};

function validateAccessToken(accessToken) {
  try {
    jwt.verify(accessToken, `${env.SECRET_KEY}`); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Refresh Token을 검증합니다.
function validateRefreshToken(refreshToken) {
  try {
    jwt.verify(refreshToken, `${env.SECRET_KEY}`); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Access Token의 Payload를 가져옵니다.
function getAccessTokenPayload(accessToken) {
  try {
    const payload = jwt.verify(accessToken, `${env.SECRET_KEY}`); // JWT에서 Payload를 가져옵니다.
    return payload;
  } catch (error) {
    return null;
  }
}
