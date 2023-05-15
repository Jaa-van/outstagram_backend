const FollowRepository = require("../repositories/follow.repository");

class FollowService {
  followRepository = new FollowRepository();

  putFollow = async (userId, followUserId) => {
    const updateFollow = await this.followRepository.updateFollowDb(
      userId,
      followUserId,
    );
    if (updateFollow == "followCreate") return "팔로우 하였습니다.";
    else return "팔로우 취소하였습니다.";
  };
}

module.exports = FollowService;
