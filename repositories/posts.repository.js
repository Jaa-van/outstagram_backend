const { Op } = require("sequelize");
const sequelize = require("sequelize");

class PostsRepository {
  constructor(postsModel, usersModel, likesModel, followsModel, commentsModel) {
    this.postsModel = postsModel;
    this.usersModel = usersModel;
    this.likesModel = likesModel;
    this.followsModel = followsModel;
    this.commentsModel = commentsModel;
  }

  findPostById = async (postId) => {
    return await this.postsModel.findOne({
      where: { postId },
    });
  };

  //게시물 생성
  createPost = async (userId, content, postPhoto) => {
    return await this.postsModel.create({
      UserId: userId,
      content,
      postPhoto,
    });
  };

  //게시글 수정
  updatePost = async (postId, content, postPhoto) => {
    return await this.postsModel.update(
      { postPhoto, content },
      { where: { postId: postId } },
    );
  };

  //게시글 삭제
  deletePost = async (postId) => {
    await this.postsModel.destroy({ where: { postId } });
  };

  // 사용자가 팔로우한 사용자들의 ID 가져오기
  findFollowings = async (userId) => {
    return this.followsModel.findAll({
      where: { UserId: userId },
      attributes: ["followUserId"],
    });
  };

  //사용자가 팔로우한 사용자들의 게시물 가져오기
  findPostsOfFollowings = async (followedUserIds, userId) => {
    const posts = await this.postsModel.findAll({
      where: { UserId: followedUserIds },
      attributes: [
        "postId",
        "UserId",
        "content",
        "postPhoto",
        "createdAt",
        "updatedAt",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM Likes WHERE Likes.PostId = Posts.postId)",
          ),
          "likesCount",
        ],
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM Comments WHERE Comments.PostId = Posts.postId)",
          ),
          "commentsCount",
        ],
      ],
      include: [
        {
          model: this.usersModel,
          attributes: ["nickname", "userPhoto"],
        },
      ],
    });

    posts.sort((a, b) => b.createdAt - a.createdAt);

    const postsLikes = await Promise.all(
      posts.map(async (post) => {
        const postJSON = post.toJSON();
        const likes = await this.likesModel.findOne({
          where: {
            [Op.and]: [{ PostId: postJSON.postId }, { UserId: userId }],
          },
        });
        postJSON.isLiked = !!likes;

        return postJSON;
      }),
    );

    return postsLikes;
  };

  // 사용자 아이디의 전체 게시물 조회
  findPostsByUserId = async (userId) => {
    return await this.postsModel.findAll({ where: { UserId: userId } });
  };

  //탐색 페이지
  findPostsByRandom = async (userId) => {
    const posts = await this.postsModel.findAll({
      order: sequelize.literal("RAND()"),
      attributes: [
        "postId",
        "UserId",
        "content",
        "postPhoto",
        "createdAt",
        "updatedAt",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM Likes WHERE Likes.PostId = Posts.postId)",
          ),
          "likesCount",
        ],
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM Comments WHERE Comments.PostId = Posts.postId)",
          ),
          "commentsCount",
        ],
      ],
      include: [
        {
          model: this.usersModel,
          attributes: ["nickname", "userPhoto"],
        },
      ],
    });

    const postsLikes = await Promise.all(
      posts.map(async (post) => {
        const postJSON = post.toJSON();
        const likes = await this.likesModel.findOne({
          where: {
            [Op.and]: [{ PostId: postJSON.postId }, { UserId: userId }],
          },
        });
        postJSON.isLiked = !!likes;

        return postJSON;
      }),
    );

    return postsLikes;
  };

  findFollow = async (followUserId, userId) => {
    return await this.followsModel.findOne({
      where: { [Op.and]: [{ followUserId }, { UserId: userId }] },
      attributes: ["followId"],
    });
  };

  findPostWithLikeCounts = async (postId) => {
    const post = await this.postsModel.findOne({
      where: { postId },
      attributes: [
        "postId",
        "UserId",
        "content",
        "postPhoto",
        "createdAt",
        "updatedAt",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM Likes WHERE Likes.PostId = Posts.postId)",
          ),
          "likesCount",
        ],
      ],
      include: [
        {
          model: this.usersModel,
          attributes: ["nickname", "userPhoto"],
        },
      ],
    });

    const like = await this.likesModel.findOne({
      where: {
        [Op.and]: [{ PostId: post.postId }, { UserId: post.UserId }],
      },
    });

    post.isLiked = !!like;

    return post;
  };

  updateLike = async (postId, userId) => {
    const like = await this.likesModel.findOne({
      where: {
        [Op.and]: [{ PostId: postId }, { UserId: userId }],
      },
    });

    if (like) {
      await this.likesModel.destroy({
        where: {
          [Op.and]: [{ PostId: postId }, { UserId: userId }],
        },
      });
    } else {
      await this.likesModel.create({
        PostId: postId,
        UserId: userId,
      });
    }
    return like;
  };

  findPostsBySearch = async (search) => {
    return await this.postsModel.findAll({
      where: {
        content: {
          [Op.like]: `%${search}%`,
        },
      },
    });
  };
}
module.exports = PostsRepository;
