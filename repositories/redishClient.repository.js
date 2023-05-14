const redis = require("redis");
require("dotenv").config();
const sequelize = require("sequelize");

class RedisClientRepository {
  constructor() {
    this.redisClient = redis.createClient({
      url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
      legacyMode: true,
    });

    this.redisConnected = false;
  }

  initialize = async () => {
    this.redisClient.on("connect", () => {
      this.redisConnected = true;
      console.info("Redis connected!");
    });
    this.redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
    });
    if (!this.redisConnected) this.redisClient.connect().then(); // redis v4 연결 (비동기)
  };

  setRefreshToken = async (refreshToken, email) => {
    await this.initialize();
    await this.redisClient.v4.set(refreshToken, email);
  };

  getRefreshToken = async (refreshToken) => {
    await this.initialize();
    const token = await this.redisClient.v4.get(refreshToken);
    return token;
  };

  deleteRefreshToken = async (refreshToken) => {
    await this.initialize();
    await this.redisClient.v4.del(refreshToken);
  };
}

module.exports = RedisClientRepository;
