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
      throw new Error(error.message || "400/유저 팔로우에 실패하였습니다.");
    }
  };
}

module.exports = FollowController;
