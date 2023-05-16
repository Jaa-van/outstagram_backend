const { Follows, Users } = require("../models");
const { Op } = require("sequelize");

class FollowRepository {
  updateFollowDb = async (userId, followUserId) => {
    const existsFollowUser = await Follows.findOne({
      where: {
        [Op.and]: [{ UserId: userId }, { followUserId: followUserId }],
      },
    });
    if (existsFollowUser) {
      await Follows.destroy({
        where: {
          [Op.and]: [{ UserId: userId }, { followUserId: followUserId }],
        },
      });
      return "followDestroy";
    } else {
      await Follows.create({
        UserId: userId,
        followUserId: followUserId,
      });
      return "followCreate";
    }
  };

  findUserById = async (followUserId) => {
    const existsUser = await Users.findOne({
      where: { UserId: followUserId },
    });
    return existsUser;
  };
}

module.exports = FollowRepository;
