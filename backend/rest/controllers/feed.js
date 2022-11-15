const fs = require("fs");
const path = require("path");
const moment = require("moment");

const { validationResult } = require("express-validator/check");

const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
  const year = req.query.year;
  console.log("year", year);

  const currentPage = req.query.page || 1;
  const perPage = 5;
  let totalItems;

  if (year === "All") {
    Post.find()
      .countDocuments()
      .then((count) => {
        totalItems = count;
        return Post.find()
          .skip((currentPage - 1) * perPage)
          .limit(perPage);
      })
      .then((posts) => {
        console.log(posts);
        res.status(200).json({
          message: "Fetched posts successfully.",
          posts: posts,
          totalItems: totalItems,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } else {
    Post.find({
      date: {
        $gt: new Date(moment(year).startOf("year")),
        $lt: new Date(moment(year).endOf("year")),
      },
    })
      .countDocuments()
      .then((count) => {
        totalItems = count;
        return Post.find({
          date: {
            $gt: new Date(moment(year).startOf("year")),
            $lt: new Date(moment(year).endOf("year")),
          },
        })
          .skip((currentPage - 1) * perPage)
          .limit(perPage);
      })

      .then((posts) => {
        console.log(posts);
        res.status(200).json({
          message: "Fetched posts successfully.",
          posts: posts,
          totalItems: totalItems,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};

exports.createPost = (req, res, next) => {
  console.log(req.body);
  console.log(req.userId);
  console.log(req);
  const title = req.body.title;
  const amount = req.body.amount;
  const date = req.body.date;
  let creator;
  const post = new Post({
    title: title,
    amount: amount,
    date: date,
    creator: req.userId,
  });
  console.log("POST", post);
  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      console.log("USER", user);
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: post,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Post fetched.", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const amount = req.body.amount;
  const date = req.body.date;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }

      post.title = title;
      post.amount = amount;
      post.date = date;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated!", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }

      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted post." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
