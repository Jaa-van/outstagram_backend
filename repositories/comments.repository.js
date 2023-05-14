const { Comments, Posts } = require("../models");

class CommentRepository {
    // 메인 페이지 댓글 생성
    createComment = async ( userId, postId, comment ) => {
        const createCommentData = await Comments.create({
            UserId: userId,
            PostId: postId,
            comment
        });
        return createCommentData;
    };
    findOnePost = async (postId) => {
        return await Posts.findOne({ where: { postId }});
    };

    findComments = async (postId) => {
        return await Comments.findAll({ where: { commentId }});
    }



}

module.exports = CommentRepository;