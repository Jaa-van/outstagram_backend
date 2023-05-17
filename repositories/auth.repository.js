const { Op } = require("sequelize");

// Model.findAll({
//   where: {
//     yourField: {
//       [Op.like]: 'a%t'
//     }
//   }
// });

class AuthRepository {
  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  loginDb = async (email, password) => {
    return await this.usersModel.findOne({
      where: { email, password },
    });
  };
  findByEmail = async (email) => {
    return await this.usersModel.findOne({
      where: { email },
    });
  };
  findUserById = async (userId) => {
    return await this.usersModel.findOne({
      where: { userId },
    });
  };
  findByNickname = async (nickname) => {
    return await this.usersModel.findOne({
      where: { nickname },
    });
  };
  findNicknamesBySearch = async (search) => {
    return await this.usersModel.findAll({
      where: {
        nickname: {
          [Op.like]: `%${search}%`,
        },
      },
    });
  };
  createId = async (email, name, nickname, password, userPhoto) => {
    return await this.usersModel.create({
      email,
      name,
      nickname,
      password,
      userPhoto,
    });
  };
}

module.exports = AuthRepository;
