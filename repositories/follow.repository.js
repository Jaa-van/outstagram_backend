const { Op } = require("sequelize");
const sequelize = require("sequelize");
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

  // // 내가 팔로우 누른 사람들의 리스트
  getFollowersByFollowUserId = async (myUserId) => {
    const followerList = await this.usersModel.findAll({
      attributes: ["name", "nickname", "userPhoto"],
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
    return followerList;
  };

  getFollowByUserId = async (myUserId) => {
    const follows = await this.usersModel.findAll({
      attributes: ["name", "nickname", "userPhoto"],
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
    return follows;
  };

  // 나를 팔로우 한 사람들의 리스트

  // 의도: 나를 팔로우한 유저들의 id(followUserId)를 Follows 테이블에서 가져와서
  //      그 유저들의 정보(name, nickname, userPhoto)를 가져오기

  // 문제: Follows 테이블의 UserId(팔로워)와 followUserId(팔로잉) 둘 다
  //      Users 테이블의 userId를 참조하는데
  //      아래 코드에서는 Users.userId = Follows.followUserId를 기준으로 INNER JOIN이 됨.
  //      왜 하필 followUserId인지? UserId도 Users.userId를 참조하는데..

  // Follows.UserId = User.userId => 얘는 어디갔음??

  // getFollowersByFollowUserId = async (myUserId) => {
  //   const followerList = await this.followsModel.findAll({
  //     include: [
  //       {
  //         model: this.usersModel,
  //         attributes: ["name", "nickname", "userPhoto"],
  //         required: true,
  //         where: {
  //           userId: myUserId,
  //         },
  //         on: { userId: sequelize.col("Follows.followUserId") },
  //       },
  //     ],
  //   });
  //   return followerList;
  // };

  // getFollowersByFollowUserId = async (myUserId) => {
  //   const followerList = await this.usersModel.findAll({
  //     attributes: ["name", "nickname", "userPhoto"],
  //     include: [
  //       {
  //         model: this.followsModel,
  //         attributes: [],
  //         required: true,
  //         where: {
  //           followUserId: myUserId,
  //         },
  //       },
  //     ],
  //   });
  //   return followerList;
  // };
}

module.exports = FollowRepository;
