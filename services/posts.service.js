const PostRepository = require("../repositories/posts.repository");

const { Posts, Users, Likes, Follows } = require("../models");

class PostService {
  postRepository = new PostRepository(Posts, Users, Likes, Follows);
  //게시글 생성
  createPost = async (userId, content, postPhoto) => {
    return await this.postRepository.createPost(userId, content, postPhoto);
  };
  //게시글 수정
  findOnePost = async (postId) => {
    return await this.postRepository.findOnePost(postId);
  };
  putPost = async (postId, content) => {
    return await this.postRepository.putPost(postId, content);
  };
  //게시글 삭제
  deletePost = async (postId) => {
    return await this.postRepository.deletePost(postId);
  };
  //메인페이지

  findAllFollowsPost = async (userId) => {
    const followings = await this.postRepository.getFollowings(userId);

    const followedUserIds = await followings.map(
      (following) => following.followUserId,
    );

    const followedPosts = await this.postRepository.getPostsByUserIds(
      followedUserIds,
      userId,
    );

    const result = await Promise.all(
      followedPosts.map(async (post) => {
        let mine;
        if (post.UserId == userId) {
          mine = true;
        } else {
          mine = false;
        }
        return {
          postId: post.postId,
          UserId: post.UserId,
          content: post.content,
          postPhoto: post.postPhoto,
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          nickname: post.User.nickname,
          userPhoto: post.User.userPhoto,
          mine: mine,
          isliked: post.isLiked,
          follow: true,
        };
      }),
    );
    return result;
  };

  //탐색페이지
  getRandomPosts = async (userId) => {
    const randomPosts = await this.postRepository.getRandomPostsFromDb(userId);

    const result = await Promise.all(
      randomPosts.map(async (post) => {
        let mine;
        if (post.UserId == userId) {
          mine = true;
        } else {
          mine = false;
        }
        return {
          postId: post.postId,
          UserId: post.UserId,
          content: post.content,
          postPhoto: post.postPhoto,
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          nickname: post.User.nickname,
          userPhoto: post.User.userPhoto,
          mine: mine,
          isliked: post.isLiked,
          follow: true,
        };
      }),
    );
    return result;
  };

  //게시글좋아요
  putLike = async (postId, userId) => {
    const existsPost = await this.postRepository.findOnePost(postId);
    if (!existsPost) {
      throw new Error("404/게시글이 존재하지 않습니다.");
    }
    const updatedLike = await this.postRepository.updateLikeDb(postId, userId);
    if (updatedLike == "likesCreate") {
      return "게시글의 좋아요를 등록하였습니다.";
    } else {
      return "게시글의 좋아요를 취소하였습니다.";
    }
  };
}

module.exports = PostService;
