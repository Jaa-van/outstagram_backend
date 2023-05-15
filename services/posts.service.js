const PostRepository = require("../repositories/posts.repository");
const { Posts } = require("../models");

class PostService {
  postRepository = new PostRepository();
  //게시글 생성
  createPost = async (userId, content, postPhoto) => {
    const createPostData = await this.postRepository.createPost(
      userId,
      content,
      postPhoto,
    );
    return createPostData;
  };
  //게시글 수정
  findOnePost = async (postId) => {
    const findOnePost = await this.postRepository.findOnePost(postId);
    return findOnePost;
  };
  putPost = async (postId, content) => {
    const checkPost = await this.postRepository.putPost(postId, content);
    return checkPost;
  };
  //게시글 삭제
  deletePost = async (postId) => {
    const deletePost = await this.postRepository.deletePost(postId);
    return deletePost;
  };
  //메인페이지
  findAllFollowsPost = async (userId) => {
    const FollowPost = await this.postRepository.findAllFollowsPost(userId);
    return FollowPost;
  };
}

module.exports = PostService;
