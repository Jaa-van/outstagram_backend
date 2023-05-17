module.exports = async (error, req, res, next) => {
  // 400번 에러는 여기서 한꺼번에 처리
  if (!error.message) {
    error.message = `400/${error.failedApi}에 실패했습니다.`;
  }

  const [status, errorMessage] = error.message.split("/");
  console.error(error);
  // status를 넘버로 형변환
  return res.status(status).json({ errorMessage });
};
