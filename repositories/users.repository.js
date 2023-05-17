const { Op } = require("sequelize");

class UsersRepository {
  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  // 이메일과 비밀번호가 일치하는 사용자 조회
  findUserByEmailAndPassword = async (email, password) => {
    return await this.usersModel.findOne({
      where: { email, password },
    });
  };

  // 이메일이 일치하는 사용자 조회
  findUserByEmail = async (email) => {
    return await this.usersModel.findOne({
      where: { email },
    });
  };

  // 아이디가 일치하는 사용자 조회
  findUserById = async (userId) => {
    return await this.usersModel.findOne({
      where: { userId },
    });
  };

  // 닉네임이 일치하는 사용자 조회
  findUserByNickname = async (nickname) => {
    return await this.usersModel.findOne({
      where: { nickname },
    });
  };

  // 닉네임에 검색어가 포함된 사용자 조회
  findNicknamesBySearch = async (search) => {
    return await this.usersModel.findAll({
      where: {
        nickname: {
          [Op.like]: `%${search}%`,
        },
      },
    });
  };

  // 사용자 생성
  createUser = async (email, name, nickname, password, userPhoto) => {
    return await this.usersModel.create({
      email,
      name,
      nickname,
      password,
      userPhoto,
    });
  };
}

module.exports = UsersRepository;
