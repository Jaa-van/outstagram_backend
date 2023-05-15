const { Posts } = require("../models");
const { Op } = require("sequelize");

class PostRepository {
  //롤링페이퍼 생성
  creatPost = async (userId, content, postPhoto) => {
    const createPostData = await Posts.create({
      UserId: userId,
      content,
      postPhoto,
    });
    return createPostData;
  };

  //게시글 수정
  putPost = async (postId, content, postPhoto) => {
    const checkPost = await Posts.findByPk(postId);
    const putPost = await checkPost.update(
      { postPhoto, content },
      { where: { postId: postId } },
    );
    return putPost;
  };

  //게시글 삭제
  deletePost = async (postId) => {
    const deletePost = await Posts.findByPk(postId);
    await deletePost.destroy();
    return;
  };

  //메인페이지
  //내가팔로우한 사람들의 게시글 조회
  findAllFollowsPost = async (userId) => {
    const findAllFollowsPost = await Posts.findAll({
      include: [
        {
          model: Users,
          attributes: ["nickname", "userPhoto"],
        },
        {
          model: Likes,
          attributes: ["likeId"],
          where: { [Op.and]: [{ PostId: postId }, { UserId: userId }] },
        },
      ],
      where: { userId },
    });
    findAllFollowsPost.sort((a, b) => b.createdAt - a.createdAt);

    const postsLikes = await Promise.all(
      findAllFollowsPost.map(async (post) => {
        const postJSON = post.toJSON();
        const likes = await Likes.findOne({
          where: { [Op.and]: [{ PostId: postJSON.id }, { UserId: userId }] },
        });
        postJSON.isLiked = !!likes;
        return postJSON;
      }),
    );

    return postsLikes;
  };
}
module.exports = PostRepository;
