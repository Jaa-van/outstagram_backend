const redis = require("redis");
const sequelize = require("sequelize");
require("dotenv").config();

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

    this.redisClient.on("error", (error) => {
      console.error("Redis Client Error", error);
    });

    if (!this.redisConnected) {
      this.redisClient.connect().then();
    }
  };

  setRefreshToken = async (refreshToken, email) => {
    await this.initialize();
    await this.redisClient.v4.set(refreshToken, email);
  };

  getRefreshToken = async (refreshToken) => {
    await this.initialize();
    return await this.redisClient.v4.get(refreshToken);
  };

  deleteRefreshToken = async (refreshToken) => {
    await this.initialize();
    await this.redisClient.v4.del(refreshToken);
  };
}

module.exports = RedisClientRepository;
