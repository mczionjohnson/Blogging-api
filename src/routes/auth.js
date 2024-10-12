import { Router } from "express";
import logger from "../logger/logger.js";

import Blog from "../models/blogSchema.js";
import User from "../models/userSchema.js";

import checkAuth from "../middleware/auth.middleware.js";

import * as authController from "../controllers/userBlog.controller.js";

const authRouter = Router();

// check token for routes
authRouter.all("*", checkAuth);

authRouter.get("/profile", authController.getUserProfile);

authRouter.get("/mywhistles", authController.getAuthBlogs);

// move this code below to the authController
authRouter.get("/mywhistles/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const user = req.body.user;
  const email = user.email;
  //
  try {
    const singleBlog = await Blog.find({
      _id: blogId,
    });
    if (!singleBlog) {
      return res.json({ message: "not found" });
    } else {
      res.status(200).json({ message: "viewing a blog", singleBlog });
      logger.info(`Success: ${email} viewed a blog`);
    }
  } catch {
    res.status(404).json({ message: "not found" });
  }
});

// create a post
authRouter.post("/mywhistles", async (req, res) => {
  const user = req.body.user;
  const id = user._id;

  try {
    const count = Object.keys(req.body.post).length;

    const readingTime = count;
    const post = req.body.post;
    const state = req.body.state;

    const blog = new Blog({
      state: state,
      body: post,
      readingTime: readingTime,
      user: id,
    });

    const savedBlog = await blog.save();

    res.status(200).json({ message: "Blog created", savedBlog });
    logger.info(`Success: ${user.email} posted a blog`);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "unsuccessful" });
  }
});

// update a post
authRouter.patch("/mywhistles/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const { body, state } = req.body;

  const user = req.body.user;
  const email = user.email;

  let checkUser = await User.findOne({ email });
  const singleBlog = await Blog.findOne({ _id: blogId });

  // checking the real owner of a blog
  // (user._id == singleBlog.user) will not work
  // .equals special to mongoDb objectID type
  if (checkUser._id.equals(singleBlog.user)) {
    if (!body && !state) {
      return res.status(400).json({ message: "please provide an update" });
    }

    const payload = {};
    if (body) {
      payload.body = body;
    }
    if (state) {
      payload.state = state;
    }
    // logger.info(payload)

    const updatedBlog = await Blog.findOneAndUpdate({ _id: blogId }, payload, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(400).json({ message: "Blog not found" });
    }

    logger.info(`Success: ${user.email} updated a blog`);
    res.status(200).json({ message: "Blog Updated", updatedBlog });
  } else {
    // in case of error
    const realOwner = await User.findOne({ _id: singleBlog.user });
    logger.error(`Edit not allowed, the owner is ${realOwner.email}`);
    res.json({ message: "Unsuccesful, You are not the owner" });
  }
});

// delete a post
authRouter.delete("/mywhistles/:blogId", async (req, res) => {
  const { blogId } = req.params;

  const user = req.body.user;
  const id = user._id;

  try {
    const deletedBlog = await Blog.deleteOne({
      $and: [{ _id: blogId }, { user: id }],
    });
    res.json({ message: "Blog Deleted", deletedBlog });
    logger.info(`Success: ${user.email} deleted a blog`);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "unsuccessful" });
  }
});

export default authRouter;
