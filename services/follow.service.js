const FollowsRepository = require("../repositories/follow.repository");
const PostsRepository = require("../repositories/posts.repository");
const UsersRepository = require("../repositories/users.repository");

const { Posts, Users, Follows } = require("../models");

class FollowsService {
  followsRepository = new FollowsRepository(Follows, Users);
  usersRepository = new UsersRepository(Users);
  postsRepository = new PostsRepository(Posts, Users, Follows);

  findPageByUserId = async (myUserId, userId) => {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new Error("404/존재하지 않는 사용자입니다.");
    }

    const isFollowing = await this.followsRepository.checkIfFollowing(
      myUserId,
      userId,
    );

    const detailPosts = await this.postsRepository.findPostsByUserId(userId);
    const posts = detailPosts.map((post) => {
      return {
        postId: post.postId,
        postPhoto: post.postPhoto,
      };
    });
    const postsCount = posts.length;

    const followCount = (await this.followsRepository.findFollowings(userId))
      .length;

    const followerCount = (await this.followsRepository.findFollowers(userId))
      .length;

    const { userPhoto, nickname } = await this.usersRepository.findUserById(
      userId,
    );

    const isMine = myUserId === Number(userId);

    return {
      isFollowing,
      postsCount,
      followCount,
      followerCount,
      userPhoto,
      nickname,
      mine: isMine,
      data: posts,
    };
  };

  followAndUnfollow = async (userId, followUserId) => {
    if (userId === followUserId) {
      throw new Error("403/자신을 팔로우할 수 없습니다.");
    }

    const user = await this.usersRepository.findUserById(followUserId);
    if (!user) {
      throw new Error("404/팔로우할 유저가 존재하지 않습니다.");
    }

    return await this.followsRepository.followAndUnfollow(userId, followUserId);
  };

  findFollowers = async (myUserId) => {
    return await this.followsRepository.findFollowers(myUserId);
  };

  findFollowings = async (myUserId) => {
    return await this.followsRepository.findFollowings(myUserId);
  };

  findUsersByRandom = async () => {
    const randomUsers = await this.followRepository.findUsersByRandom();

    return randomUsers.map((user) => {
      return {
        UserId: user.userId,
        nickname: user.nickname,
        userPhoto: user.userPhoto,
      };
    });
  };
}

module.exports = FollowsService;
