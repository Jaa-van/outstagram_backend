const FollowRepository = require("../repositories/follow.repository");
const PostRepository = require("../repositories/posts.repository");

const { Posts, Users, Follows } = require("../models");

class FollowService {
  followRepository = new FollowRepository(Follows, Users);
  postRepository = new PostRepository(Posts, Users, Follows);

  getPageByUserId = async (myUserId, userId) => {
    const user = await this.followRepository.findUserById(userId);
    if (!user) {
      throw new Error("404/존재하지 않는 사용자입니다.");
    }

    // 내 페이지인지 여부
    const isMine = myUserId === Number(userId);

    // 프로필 사진, 닉네임
    const { userPhoto, nickname } = await this.followRepository.findUserById(
      userId,
    );

    // 팔로우 여부
    const isFollowing = await this.followRepository.checkIfFollowing(
      myUserId,
      userId,
    );

    // 게시글 배열 조회 / 게시글 갯수
    const detailPosts = await this.postRepository.getPostsOfUserId(userId);
    const posts = detailPosts.map((post) => {
      return {
        postId: post.postId,
        postPhoto: post.postPhoto,
      };
    });
    const postsCount = posts.length;

    // 팔로워 갯수
    const followerCount = (
      await this.followRepository.getFollowByUserId(userId)
    ).length;

    // 팔로우 갯수
    const followCount = (
      await this.followRepository.getFollowersByFollowUserId(userId)
    ).length;

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

  getFollower = async (myUserId) => {
    const followerListFromDb =
      await this.followRepository.getFollowersByFollowUserId(myUserId);
    return followerListFromDb;
  };

  getFollow = async (myUserId) => {
    const followListFromDb = await this.followRepository.getFollowByUserId(
      myUserId,
    );
    return followListFromDb;
  };
}

module.exports = FollowService;
