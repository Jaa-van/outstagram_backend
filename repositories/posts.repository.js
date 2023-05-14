const { Posts } = require("../models");

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

  //게시글 상세 조회
  findOnePost = async (postId) => {
    const findOnePost = await Posts.findByPk(postId);
    return findOnePost;
  };
}
module.exports = PostRepository;
