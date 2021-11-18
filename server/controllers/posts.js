const mongoose = require("mongoose");
const PostMessage = require("../models/postMessage");

const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostMessage.findById(id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(404).json(err);
  }
};

const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await PostMessage.countDocuments({});
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    return res.status(200).json({
      data: posts,
      currenntPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i"); // i stands for ignore case

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    res.status(200).json({ data: posts });
  } catch (err) {
    res.status(404).json(err);
  }
};

const createPost = async (req, res) => {
  const post = req.body;

  if (!req.userId) return res.status(403).json({ message: "Unauthorised." });

  const newPost = PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updatePost = async (req, res) => {
  const _id = req.params.id;
  const post = req.body;

  if (!req.userId) return res.status(403).json({ message: "Unauthorised." });

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Post not found.");

  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    return res.status(200).json(updatedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deletePost = async (req, res) => {
  const _id = req.params.id;

  if (!req.userId) return res.status(403).json({ message: "Unauthorised." });

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Post not found.");

  try {
    await PostMessage.findByIdAndRemove(_id);
    return res.status(200).json({ message: "Post deleted succcessfully." });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const likePost = async (req, res) => {
  const _id = req.params.id;

  if (!req.userId) return res.status(403).json({ message: "Unauthorised." });

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Post not found.");

  try {
    const post = await PostMessage.findById(_id);

    const index = post.likes.findIndex(
      (id) => id.toString() === req.userId.toString()
    );
    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    return res.status(200).json(updatedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const commentPost = async (req, res) => {
  const _id = req.params.id;
  const { value } = req.body;

  if (!req.userId) return res.status(403).json({ message: "Unauthorised." });

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Post not found.");

  try {
    const post = await PostMessage.findById(_id);
    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    return res.status(200).json(updatedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  getPostsBySearch,
};
