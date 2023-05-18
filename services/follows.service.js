const FollowsRepository = require("../repositories/follows.repository");
const PostsRepository = require("../repositories/posts.repository");
const UsersRepository = require("../repositories/users.repository");

const { Posts, Users, Follows } = require("../models");

class FollowsService {
  followsRepository = new FollowsRepository(Follows, Users);
  usersRepository = new UsersRepository(Users);
  postsRepository = new PostsRepository(Posts, Users, Follows);

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

  findFollowings = async (myUserId) => {
    return await this.followsRepository.findFollowings(myUserId);
  };

  findFollowers = async (myUserId) => {
    return await this.followsRepository.findFollowers(myUserId);
  };

  findPageByUserId = async (myUserId, userId) => {
    const user = await this.followsRepository.findUserById(userId);
    if (!user) {
      throw new Error("404/존재하지 않는 사용자입니다.");
    }

    const isFollowing = await this.followsRepository.checkIfFollowing(
      myUserId,
      userId,
    );

    const detailPosts = await this.postRepository.findPostsByUserId(userId);
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
}

module.exports = FollowsService;
