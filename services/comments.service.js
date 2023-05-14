const CommentRepository = require("../repositories/comments.repository.js");

class CommentService {
    commentRepository = new CommentRepository();

    // 메인 페이지 댓글 생성
    createComment = async ( comment, userId, postId ) => {

        // 저장소(Repository)에게 데이터를 요청합니다.
        const createCommentData = await this.commentRepository.createComment( userId, postId, comment );

        // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
        return createCommentData;
    };

    // 게시물 조회 (with postId)
    findOnePost = async(postId) => {
        return await this.commentRepository.findOnePost(postId);
    };

    // 댓글 전체 조회 (with postId)
    findComments = async(postId) => {
        const findCommentsData = await this.commentRepository.findComments(postId);
        const result = findCommentsData.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
        return result;
    }

    // 댓글 한개 조회 (with postId, commentId)

    

}


module.exports = CommentService;