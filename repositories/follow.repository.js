const { Op } = require("sequelize");
const sequelize = require("sequelize");

class FollowsRepository {
  constructor(followsModel, usersModel) {
    this.followsModel = followsModel;
    this.usersModel = usersModel;
  }

  // 팔로우/언팔로우
  followAndUnfollow = async (userId, followUserId) => {
    const follow = await this.followsModel.findOne({
      where: {
        [Op.and]: [{ UserId: userId }, { followUserId }],
      },
    });

    if (follow) {
      await this.followsModel.destroy({
        where: {
          [Op.and]: [{ UserId: userId }, { followUserId }],
        },
      });
    } else {
      await this.followsModel.create({
        UserId: userId,
        followUserId,
      });
    }
    return follow ? false : true;
  };

  // myUserId가 userId를 팔로우하는 지 체크
  checkIfFollowing = async (myUserId, userId) => {
    const following = await this.followsModel.findOne({
      where: {
        UserId: myUserId,
        followUserId: userId,
      },
    });

    return following ? true : false;
  };

  // 팔로잉 리스트 조회
  // UserId(팔로워)가 myUserId
  // 즉, 내가 팔로우하는 사용자(팔로잉) 리스트
  findFollowings = async (myUserId) => {
    return await this.usersModel.findAll({
      attributes: ["userId", "name", "nickname", "userPhoto"],
      include: [
        {
          model: this.followsModel,
          attributes: [],
          required: true,
          where: {
            UserId: myUserId,
          },
        },
      ],
    });
  };

  // 팔로워 리스트 조회
  // followUserId(팔로우 당한 사용자)가 myUserId
  // 즉, 나를 팔로우하는 사용자(팔로워) 리스트
  findFollowers = async (myUserId) => {
    return await this.usersModel.findAll({
      attributes: ["userId", "name", "nickname", "userPhoto"],
      include: [
        {
          model: this.followsModel,
          attributes: [],
          required: true,
          where: { followUserId: myUserId },
          on: {
            [Op.and]: sequelize.literal(
              "`Users`.`userId` = `Follows`.`UserId`",
            ),
          },
        },
      ],
    });
  };

  findUsersByRandom = async () => {
    return await this.usersModel.findAll({
      order: sequelize.literal("RAND()"),
      limit: 8,
      attributes: ["userId", "nickname", "userPhoto"],
    });
  };
}

module.exports = FollowsRepository;
