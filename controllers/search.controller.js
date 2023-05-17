const SearchService = require("../services/search.service");

class SearchController {
  searchService = new SearchService();

  //게시물 생성
  searchUsersAndPosts = async (req, res, next) => {
    try {
      const { search } = req.body;
      if (!search || search === "" || typeof search !== "string") {
        throw new Error("419/검색어의 형식이 올바르지 않습니다.");
      }

      const result = await this.searchService.searchUsersAndPosts(search);

      console.log(result);

      res.status(200).json(result);
    } catch (error) {
      error.failedApi = "검색";
      throw error;
    }
  };
}

module.exports = SearchController;
