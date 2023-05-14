const PostRepository = require("../repositories/posts.repository");
const { Posts } = require("../models");

class PostService {
  PostRepository = new PostRepository(Posts);
  //게시글 생성
  creatPost = async (userId, content, postPhoto) => {
    const createPostData = await this.PostRepository.createPost(
      userId,
      content,
      postPhoto,
    );
    return createPostData;
  };
  //게시글 수정
  findOnePost = async (postId) => {
    const findOnePost = await this.PostRepository.findOnePost(postId);
    return findOnePost;
  };
  putPost = async (postId, content) => {
    const checkPost = await this.PostRepository.putPost(postId, content);
    return checkPost;
  };
  //게시글 삭제
  deletePost = async (postId) => {
    const deletePost = await this.PostRepository.deletePost(postId);
    return deletePost;
  };
}

module.exports = PostService;
