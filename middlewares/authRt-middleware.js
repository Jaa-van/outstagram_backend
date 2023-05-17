const jwt = require("jsonwebtoken");

// 사용하지 않는 redis 삭제

require("dotenv").config();
const env = process.env;

const { users } = require("../models");
const RedisClientRepository = require("../repositories/redisClient.repository");

module.exports = async (req, res, next) => {
  const redisClientRepository = new RedisClientRepository();
  const { accessToken, refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new Error("400/Refresh Token이 존재하지 않습니다.");
  }

  if (!accessToken) {
    throw new Error("400/Access Token이 존재하지 않습니다.");
  }

  // 아래 두 줄 삭제 가능?
  const [authTypeAt, AT] = (accessToken ?? "").split(" ");
  const [authTypeRt, RT] = (refreshToken ?? "").split(" ");

  const isAccessToken = validateAccessToken(accessToken);
  const isRefreshToken = validateRefreshToken(refreshToken);

  let newAccessToken;

  if (!isRefreshToken) {
    throw new Error("419/refresh Token이 유효하지 않습니다.");
  }

  if (!isAccessToken) {
    const accessTokenId = await redisClientRepository.getRefreshToken(
      refreshToken,
    );

    if (!accessTokenId) {
      throw new Error("419/refresh Token의 정보가 서버에 존재하지 않습니다.");
    }

    const tempAccessToken = jwt.sign(
      { userId: accessTokenId },
      `${env.SECRET_KEY}`,
      {
        expiresIn: "10s",
      },
    );
    res.cookie("accessToken", tempAccessToken);
    newAccessToken = tempAccessToken;
    console.log("access token을 다시 발급하였습니다.");
  }

  let userId;

  if (newAccessToken) {
    userId = getAccessTokenPayload(newAccessToken).userId;
  } else {
    userId = isAccessToken.userId;
  }

  const user = await users.findOne({
    where: { userId: userId },
  });

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
    // 바로 리턴
    return jwt.verify(accessToken, `${env.SECRET_KEY}`); // JWT에서 Payload를 가져옵니다.
  } catch (error) {
    return null;
  }
}
