const FollowRepository = require("../repositories/follow.repository");

const { Follows, Users } = require("../models");

class FollowService {
  followRepository = new FollowRepository(Follows, Users);

  putFollow = async (userId, followUserId) => {
    if (userId == followUserId) {
      throw new Error("403/자신을 팔로우할 수 없습니다.");
    }

    const existsUser = await this.followRepository.findUserById(followUserId);
    if (!existsUser) {
      throw new Error("404/팔로우할 유저가 존재하지 않습니다.");
    }

    const updateFollow = await this.followRepository.updateFollowDb(
      userId,
      followUserId,
    );

    if (updateFollow == "followCreate") {
      return "팔로우 하였습니다.";
    } else {
      return "팔로우 취소하였습니다.";
    }
  };
}

module.exports = FollowService;
