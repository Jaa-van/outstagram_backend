const CommentRepository = require("../repositories/comments.repository.js");

class CommentService {
    commentRepository = new CommentRepository();

    // 메인 페이지 댓글 생성 & 게시물 상세 조회 댓글 생성
    createComment = async (userId, postId, comment) => {

        const createCommentData = await this.commentRepository.createComment(userId, postId, comment);

        return { message: "댓글 작성 완료" };
    };

    // 게시물 조회 (with postId) 지현님 posts 하면 거기서 갖고오기
    findOnePost = async (postId) => {
        return await this.commentRepository.findOnePost(postId);
    };

    // 댓글 전체 조회 (with postId)
    findComments = async (postId) => {
        const findCommentsData = await this.commentRepository.findComments(postId);
        const result = await Promise.all(
            findCommentsData.map(async(comment) => {
                const user = await this.commentRepository.findOneUser(comment.UserId);// 유저 찾기

                return {
                    commentId: comment.commentId,
                    UserId: comment.UserId,
                    PostId: comment.PostId,
                    comment: comment.comment,
                    nickname: user.nickname, // 사용자의 닉네임 필드 추가
                    userPhoto: user.userPhoto, // 사용자의 프로필 사진 필드 추가
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                };
            })
        );

        return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // 댓글 하나 찾기 (with commentId)
    findOneComment = async (commentId) => {
        const findOneComment = await this.commentRepository.findOneComment(commentId);
        return findOneComment;
    }

    // 게시물 상세 조회 들어가서 댓글 삭제
    deleteComment = async (userId, postId, commentId) => {
        const deleteCommentData = await this.commentRepository.deleteComment(userId, postId, commentId);

        return { message: "댓글 삭제 완료" };
    }

    // 댓글 한개 조회 (with postId, commentId)

}


module.exports = CommentService;