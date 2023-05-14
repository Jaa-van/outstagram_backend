const { Users } = require("../models");

class AuthRepository {
  loginDb = async (email, password) => {
    const findId = await Users.findOne({
      where: { email, password },
    });
    return findId;
  };
  findByEmail = async (email) => {
    const existsEmail = await Users.findOne({
      where: { email },
    });
    return existsEmail;
  };
  findByNickname = async (nickname) => {
    const existsNickname = await Users.findOne({
      where: { nickname },
    });
    return existsNickname;
  };
  createId = async (email, name, nickname, password, userPhoto) => {
    const createIdDb = await Users.create({
      email,
      name,
      nickname,
      password,
      userPhoto,
    });
    return createIdDb;
  };
}

module.exports = AuthRepository;
