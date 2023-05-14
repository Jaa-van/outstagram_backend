const { Comments, Posts } = require("../models");
const { Op } = require("sequelize");


class CommentRepository {
    // 메인 페이지 댓글 생성 & 게시물 상세 조회 댓글 생성
    createComment = async (userId, postId, comment) => {
        const createCommentData = await Comments.create({
            UserId: userId,
            PostId: postId,
            comment
        });
        return createCommentData;
    };

    // 게시물 조회 (with postId)
    findOnePost = async (postId) => {
        return await Posts.findOne({ where: { postId } });
    };

    // 댓글 전체 조회 (Comments model에서 with postId)
    findComments = async (postId) => {
        return await Comments.findAll({ where: { postId } }); // 수정 필요할 듯
    }

    // 댓글 하나 찾기 (with commentId)
    findOneComment = async (commentId) => {
        const findOneComment = await this.Comments.findOne({ where: { commentId } });
        return findOneComment;
    }

    // 게시물 상세 조회 들어가서 댓글 삭제
    deleteComment = async (userId, postId, commentId) => {
        const deleteCommentData = await this.Comments.destroy({
            where: { [Op.and]: [{ UserId: userId }, { PostId: postId }, { commentId }] }
        });
        return deleteCommentData
    }

}

module.exports = CommentRepository;