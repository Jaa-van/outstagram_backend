const { Op } = require("sequelize");
const sequelize = require("sequelize");

class PostRepository {
  constructor(postsModel, usersModel, likesModel, followsModel, commentsModel) {
    this.postsModel = postsModel;
    this.usersModel = usersModel;
    this.likesModel = likesModel;
    this.followsModel = followsModel;
    this.commentsModel = commentsModel;
  }

  //롤링페이퍼 생성
  createPost = async (userId, content, postPhoto) => {
    return await this.postsModel.create({
      UserId: userId,
      content,
      postPhoto,
    });
  };

  //게시글 수정
  putPost = async (postId, content, postPhoto) => {
    const checkPost = await this.postsModel.findByPk(postId);
    return await checkPost.update(
      { postPhoto, content },
      { where: { postId: postId } },
    );
  };

  //게시글 삭제
  deletePost = async (postId) => {
    const deletePost = await this.postsModel.findByPk(postId);
    await deletePost.destroy();

    return;
  };

  // 메인 페이지

  // 사용자가 팔로우한 사람들의 ID 가져오기
  getFollowings = async (userId) => {
    return this.followsModel.findAll({
      where: { UserId: userId },
      attributes: ["followUserId"],
    });
  };

  // //사용자들이 팔로우한 유저의 게시물 가져오기
  getPostsByUserIds = async (followedUserIds, userId) => {
    const findAllFollowsPost = await this.postsModel.findAll({
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
            "(SELECT COUNT(*) FROM Likes WHERE Likes.PostId = Posts.postId)"
          ),
          "likesCount",
        ],
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM Comments WHERE Comments.PostId = Posts.postId)"
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
      // group: ['Posts.postId'],
      // distinct: true,
    });


    findAllFollowsPost.sort((a, b) => b.createdAt - a.createdAt);

    const postsLikes = await Promise.all(
      findAllFollowsPost.map(async (post) => {
        const postJSON = post.toJSON();
        const likes = await this.likesModel.findOne({
          where: {
            [Op.and]: [{ PostId: postJSON.postId }, { UserId: userId }],
          },
        });
        // !!likes === likes ?
        postJSON.isLiked = !!likes;

        return postJSON;
      }),
    );

    return postsLikes;
  };

  getPostsOfUserId = async (userId) => {
    return await this.postsModel.findAll({ where: { UserId: userId } });
  };

  commentsCount = async (postId) => {
    return await this.commentsModel.count({ where: { PostId: postId } });
  };
  likesCount = async (postId) => {
    return await this.likesModel.count({ where: { PostId: postId } });
  };

  //탐색 페이지
  getRandomPostsFromDb = async (userId) => {
    const ramdonPostsFromDb = await this.postsModel.findAll({
      order: sequelize.literal("RAND()"),
      // limit: 6,
      attributes: [
        "postId",
        "UserId",
        "content",
        "postPhoto",
        "createdAt",
        "updatedAt",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM Likes WHERE Likes.PostId = Posts.postId)"
          ),
          "likesCount",
        ],
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM Comments WHERE Comments.PostId = Posts.postId)"
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

    // ramdonPostsFromDb.sort((a, b) => b.createdAt - a.createdAt);

    const postsLikes = await Promise.all(
      ramdonPostsFromDb.map(async (post) => {
        const postJSON = post.toJSON();
        const likes = await this.likesModel.findOne({
          where: {
            [Op.and]: [{ PostId: postJSON.postId }, { UserId: userId }],
          },
        });
        // !!likes === likes ?
        postJSON.isLiked = !!likes;

        return postJSON;
      }),
    );

    return postsLikes;
  };

  //팔로우여부구하기
  postUserFollow = async (followUserId, userId) => {
    return await this.followsModel.findOne({
      where: { [Op.and]: [{ followUserId: followUserId }, { UserId: userId }] },
      attributes: ["followId"],
    });
  };

  //포스트정보
  getPost = async (postId) => {
    const postInfo = await this.postsModel.findOne({
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
            "(SELECT COUNT(*) FROM Likes WHERE Likes.PostId = Posts.postId)"
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
    return postInfo;
  };

  //게시글 좋아요

  findOnePost = async (postId) => {
    return await this.postsModel.findOne({
      where: { postId: postId },
    });
  };

  updateLikeDb = async (postId, userId) => {
    const existsLikesByUser = await this.likesModel.findOne({
      where: {
        [Op.and]: [{ PostId: postId }, { UserId: userId }],
      },
    });

    if (existsLikesByUser) {
      await this.likesModel.destroy({
        where: {
          [Op.and]: [{ PostId: postId }, { UserId: userId }],
        },
      });

      return "likesDestroy";
    } else {
      await this.likesModel.create({
        PostId: postId,
        UserId: userId,
      });

      return "likesCreate";
    }
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
module.exports = PostRepository;
