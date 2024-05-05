import { Router } from "express";
import logger from '../logger/logger.js'

import Blog from "../models/blogSchema.js";
import User from "../models/userSchema.js";

import jwt from "jsonwebtoken";
import checkAuth from "../middleware/auth.middleware.js";

import * as authController from "../controllers/userBlog.controller.js";

const authBlogRouter = Router();

authBlogRouter.all("*", checkAuth);

authBlogRouter.get("/", authController.getAuthBlogs);


// move this code below to the authController
authBlogRouter.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const email = req.user.email;

  try {
    const singleBlog = await Blog.findOne({ _id: blogId });
    const show = await Blog.findOneAndUpdate(
      { _id: blogId },
      { $inc: { readCount: 1 } } /* no more callback */
    );

    // res.json(singleBlog);
    res.status(200).json({ message: "viewing a blog", Blog: singleBlog });
    logger.info(`Success: ${email} viewed a blog`);


  } catch {
    res.status(404).json({ message: "not found" });

  }
});

authBlogRouter.post("/", async (req, res) => {
  let token = req.headers.authorization;
  token = token.split(" ")[1];

  if (!token) {
    res.json("No token provided");
  }
  if (token) {
    // SECRET is stored in .env
    jwt.verify(token, process.env.JWT_SECRET, async (err, authToken) => {
      const email = authToken.email;
      // logger.info(authToken)
      if (err) {
        res.redirect("/");
      } else {
        let user = await User.findOne({ email });

        // logger.info(user);

        const count = Object.keys(req.body.blogBody).length;
        const readingTime = count;

        const title = req.body.title;
        const description = req.body.description;
        const tags = req.body.tags;
        const author = req.user.email;
        const blogBody = req.body.blogBody;
        const state = req.body.state;

        const blog = new Blog({
          title: title,
          description: description,
          tags: tags,
          author: author,
          state: state,
          blogBody: blogBody,
          readingTime: readingTime,
          user: user,
        });

        const savedBlog = await blog.save();

        res.status(200).json({ message: "Blog created", savedBlog });
        logger.info(`Success: ${user.email} posted a blog`);

      }
    });
  }
});

authBlogRouter.patch("/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const { title, description, tags, blogBody, state } = req.body;

  let token = req.headers.authorization;
  token = token.split(" ")[1];

  if (!token) {
    res.json("No token provided");
  }
  if (token) {
    // SECRET is stored in .env
    jwt.verify(token, process.env.JWT_SECRET, async (err, authToken) => {
      if (err) {
        res.redirect("/");
      } else {
        const email = authToken.email;
        let user = await User.findOne({ email });
        const singleBlog = await Blog.findOne({ _id: blogId });

        // checking the real owner of a blog
        // (user._id == singleBlog.user) will not work
        // .equals special to mongoDb objectID type
        if (user._id.equals(singleBlog.user)) {
          if (!title && !description && !tags && !blogBody && !state) {
            return res
              .status(400)
              .json({ message: "please provide an update" });
          }

          const payload = {};
          if (title) {
            payload.title = title;
          }
          if (description) {
            payload.description = description;
          }
          if (tags) {
            payload.tags = tags;
          }
          if (blogBody) {
            payload.blogBody = blogBody;
          }
          if (state) {
            payload.state = state;
          }
          // logger.info(payload)

          const updatedBlog = await Blog.findOneAndUpdate(
            { _id: blogId },
            payload,
            {
              new: true,
            }
          );

          if (!updatedBlog) {
            return res.status(400).json({ message: "Blog not found" });
          }

          logger.info(`Success: ${user.email} updated a blog`);
          res.status(200).json({ message: "Blog Updated", Blog: updatedBlog });
        } else {
          // in case of error
          const realOwner = await User.findOne({ _id: singleBlog.user });
          logger.error(`Edit not allowed, the owner is ${realOwner.email}`);
          res.json({ message: "Unsuccesful, You are not the owner" });
        }
      }
    });
  }
});

authBlogRouter.delete("/:blogId", async (req, res) => {
  const { blogId } = req.params;

  let token = req.headers.authorization;
  token = token.split(" ")[1];

  if (!token) {
    res.json("No token provided");
  }
  if (token) {
    // SECRET is stored in .env
    jwt.verify(token, process.env.JWT_SECRET, async (err, authToken) => {
      if (err) {
        res.redirect("/");
      } else {
        const email = authToken.email;
        let user = await User.findOne({ email });
        const singleBlog = await Blog.findOne({ _id: blogId });

        if (!singleBlog) {
          res.json("Blog not found, probably wrong ID");
        }
        // (user._id == singleBlog.user) will not work
        // .equals special to mongoDb objectID type
        if (user._id.equals(singleBlog.user)) {
          const deletedBlog = await Blog.deleteOne({
            _id: blogId,
          });
          res.json({ message: "Blog Deleted", deletedBlog });
          logger.info(`Success: ${user.email} deleted a blog`);
        } else {
          // in case of error
          const realOwner = await User.findOne({ _id: singleBlog.user });
          logger.error(`Delete not allowed, the owner is ${realOwner.email}`);
          res.json({ message: "Unsuccesful, You are not the owner" });
        }
      }
    });
  }
});

export default authBlogRouter;
