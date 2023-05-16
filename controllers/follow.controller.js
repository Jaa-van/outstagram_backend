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

  // 유저 팔로워 조회
}

module.exports = FollowController;
