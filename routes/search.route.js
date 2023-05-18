const express = require("express");
const router = express.Router();

const SearchController = require("../controllers/search.controller");
const authMiddleware = require("../middlewares/auth-middleware");

const searchController = new SearchController();

router.get("/", authMiddleware, searchController.searchUsersAndPosts);

module.exports = router;
