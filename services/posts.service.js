const PostsRepository = require("../repositories/posts.repository");
const UsersRepository = require("../repositories/users.repository");
const { Posts, Users, Likes, Follows, Comments } = require("../models");

class PostService {
  postsRepository = new PostsRepository(Posts, Users, Likes, Follows, Comments);
  usersRepository = new UsersRepository(Users);

  // 메인 페이지
  findPostsOfFollowings = async (userId) => {
    const followings = await this.postsRepository.findFollowings(userId);

    const idsOfFollowings = await followings.map(
      (following) => following.followUserId,
    );
    const posts = await this.postsRepository.findPostsOfFollowings(
      idsOfFollowings,
      userId,
    );

    return await Promise.all(
      posts.map(async (post) => {
        let mine = post.UserId === userId ? true : false;

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
  };

  // 랜덤 페이지
  findPostsByRandom = async (userId) => {
    const posts = await this.postsRepository.findPostsByRandom(userId);

    return await Promise.all(
      posts.map(async (post) => {
        const follow = await this.postsRepository.findFollow(
          post.UserId,
          userId,
        );
        let followed = follow ? true : false;

        let mine = post.UserId === userId ? true : false;

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
          follow: followed,
        };
      }),
    );
  };

  findUserNicknameAndPhoto = async (userId) => {
    const user = await this.usersRepository.findUserById(userId);

    return {
      nickname: user.nickname,
      userPhoto: user.userPhoto,
      UserId: userId,
    };
  };

  // 게시글 생성
  createPost = async (userId, content, postPhoto) => {
    return await this.postsRepository.createPost(userId, content, postPhoto);
  };

  // 게시물 상세 조회
  findDetailedPost = async (postId, userId) => {
    const post = await this.postsRepository.findPostWithLikeCounts(postId);
    const follow = await this.postsRepository.findFollow(post.UserId, userId);

    let followed = follow ? true : false;

    let mine = post.UserId === userId ? true : false;

    return {
      postId: post.postId,
      UserId: post.UserId,
      content: post.content,
      postPhoto: post.postPhoto,
      likesCount: post.dataValues.likesCount,
      nickname: post.User.nickname,
      userPhoto: post.User.userPhoto,
      mine: mine,
      isLiked: post.isLiked,
      follow: followed,
    };
  };

  // 게시글 단순 조회
  findPostById = async (postId) => {
    return await this.postsRepository.findPostById(postId);
  };

  // 게시글 수정
  updatePost = async (postId, content) => {
    return await this.postsRepository.updatePost(postId, content);
  };

  // 게시글 삭제
  deletePost = async (postId) => {
    await this.postsRepository.deletePost(postId);
  };

  // 좋아요
  updateLike = async (postId, userId) => {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) {
      throw new Error("404/게시글이 존재하지 않습니다.");
    }

    return await this.postsRepository.updateLike(postId, userId);
  };
}

module.exports = PostService;
