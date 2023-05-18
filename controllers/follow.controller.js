const FollowService = require("../services/follow.service");

class FollowController {
  followService = new FollowService();

  readPageByUserId = async (req, res, next) => {
    try {
      const myUserId = res.locals.user.userId;
      const { userId } = req.params;

      const page = await this.followService.findPageByUserId(myUserId, userId);

      res.status(200).json({ page });
    } catch (error) {
      error.failedApi = "유저 페이지 조회";
      throw error;
    }
  };

  updateFollow = async (req, res, next) => {
    try {
      const followUserId = req.params.userId;
      const { userId } = res.locals.user;

      const follow = await this.followService.followAndUnfollow(
        userId,
        followUserId,
      );

      if (follow) {
        res.status(200).json({ message: "팔로우 하였습니다." });
      } else {
        res.status(200).json({ message: "팔로우 취소하였습니다." });
      }
    } catch (error) {
      error.failedApi = "유저 팔로우";
      throw error;
    }
  };

  // 팔로워 조회
  readFollowers = async (req, res, next) => {
    try {
      const myUserId = req.params.userId;

      const followers = await this.followService.findFollowers(myUserId);
      res.status(200).json(followers);
    } catch (error) {
      error.failedApi = "팔로워 조회";
      throw error;
    }
  };

  // 팔로잉 조회
  readFollowings = async (req, res, next) => {
    try {
      const myUserId = req.params.userId;

      const followings = await this.followService.findFollowings(myUserId);
      res.status(200).json(followings);
    } catch (error) {
      error.failedApi = "팔로잉 조회";
      throw error;
    }
  };

  readRandomUsers = async (req, res, next) => {
    try {
      const randomUsers = await this.followService.findUsersByRandom();

      res.status(200).json(randomUsers);
    } catch (error) {
      error.failedApi = "유저 조회";
      throw error;
    }
  };
}

module.exports = FollowController;
