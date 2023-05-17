const FollowService = require("../services/follow.service");

class FollowController {
  followService = new FollowService();

  putFollow = async (req, res, next) => {
    try {
      const followUserId = req.params.userId;
      const { userId } = res.locals.user;

      const follow = await this.followService.putFollow(userId, followUserId);

      res.status(200).json({ message: follow });
    } catch (error) {
      error.failedApi = "유저 팔로우";
      throw error;
    }
  };

  // 유저를 팔로우하는 사람들 조회
  getFollower = async (req, res, next) => {
    try {
      const myUserId = req.params.userId;

      const followerList = await this.followService.getFollower(myUserId);
      res.status(200).json(followerList);
    } catch (error) {
      error.failedApi = "팔로우 조회";
      throw error;
    }
  };
}

module.exports = FollowController;
