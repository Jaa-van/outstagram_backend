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
