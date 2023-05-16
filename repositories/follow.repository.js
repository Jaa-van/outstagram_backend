const { Op } = require("sequelize");

class FollowRepository {
  constructor(followsModel, usersModel) {
    this.followsModel = followsModel;
    this.usersModel = usersModel;
  }

  updateFollowDb = async (userId, followUserId) => {
    const existsFollowUser = await this.followsModel.findOne({
      where: {
        [Op.and]: [{ UserId: userId }, { followUserId: followUserId }],
      },
    });

    if (existsFollowUser) {
      await this.followsModel.destroy({
        where: {
          [Op.and]: [{ UserId: userId }, { followUserId: followUserId }],
        },
      });

      return "followDestroy";
    } else {
      await this.followsModel.create({
        UserId: userId,
        followUserId: followUserId,
      });

      return "followCreate";
    }
  };

  findUserById = async (followUserId) => {
    return await this.usersModel.findOne({
      where: { UserId: followUserId },
    });
  };
}

module.exports = FollowRepository;
