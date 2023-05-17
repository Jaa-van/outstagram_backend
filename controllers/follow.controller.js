const FollowService = require("../services/follow.service");

class FollowController {
  followService = new FollowService();

  getPageByUserId = async (req, res, next) => {
    try {
      const myUserId = res.locals.user.userId;
      const { userId } = req.params;

      const page = await this.followService.getPageByUserId(myUserId, userId);

      res.status(200).json({ page });
    } catch (error) {
      error.failedApi = "유저 페이지 조회";
      throw error;
    }
  };

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

  getFollow = async (req, res, next) => {
    const myUserId = req.params.userId;

    const followList = await this.followService.getFollow(myUserId);
    res.status(200).json(followList);
  };

  getRandomUsers = async (req, res, next) => {
    try {
      const randomUsers = await this.followService.getRandomUsers();

      res.status(200).json(randomUsers);
    } catch (error) {
      error.failedApi = "유저 조회";
      throw error;
    }
  };
}

module.exports = FollowController;
