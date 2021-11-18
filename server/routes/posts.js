const express = require("express");
const postController = require("../controllers/posts");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/search", postController.getPostsBySearch);

router.get("/:id", postController.getPost);

router.get("/", postController.getPosts);

router.post("/", auth, postController.createPost);

router.patch("/:id", auth, postController.updatePost);

router.delete("/:id", auth, postController.deletePost);

router.patch("/:id/like", auth, postController.likePost);

router.post("/:id/comment", auth, postController.commentPost);

module.exports = router;
