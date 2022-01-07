const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Blog = require("../models/Blog");
const auth = require("../middlewares/auth");

router.get("/", async (req, res) => {
  const userBlogs = await Blog.find({ user: req.user.id });
  const updateBlog = {};
  res.render("user", { msg: "", user: req.user, blogs: userBlogs, updateBlog });
});

router.post("/blog/create", auth, (req, res) => {
  const { title, content } = req.body;
  const newBlog = new Blog({
    title,
    content,
    user: req.user.id,
  });
  newBlog
    .save()
    .then(async (data) => {
      const userBlogs = await Blog.find({ user: req.user.id });
      res.redirect(`/profile`);
    })
    .catch(async (err) => {
      const userBlogs = await Blog.find({ user: req.user.id });
      res.redirect("/profile");
    });
});

router.post("/blog/delete/:blogId", auth, (req, res) => {
  Blog.findByIdAndDelete(req.params.blogId, function (err) {
    if (err) console.log(err);
    res.redirect("/profile");
  });
});

router.post("/blog/update/:blogId", auth, async (req, res) => {
  const updateBlog = await Blog.findOne({ id: req.params.blogId });
  Blog.findByIdAndDelete(req.params.blogId, function (err) {
    if (err) console.log(err);
  });
  const userBlogs = await Blog.find({ user: req.user.id });

  res.render("user", { msg: "", user: req.user, blogs: userBlogs, updateBlog });
});



module.exports = router;
