import { Router } from "express";

import Blog from "../models/blogSchema.js";
import User from "../models/userSchema.js";

import jwt from "jsonwebtoken";
import auth from "../authentication/auth.js";
import * as authController from "../controllers/auth.controller.js";

const authBlogRouter = Router();

authBlogRouter.all("*", auth);

authBlogRouter.get("/", authController.getAuthBlogs);

authBlogRouter.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;

  try {
    const singleBlog = await Blog.findOne({ _id: blogId });
    const show = await Blog.findOneAndUpdate(
      { _id: blogId },
      { $inc: { readCount: 1 } } /* no more callback */
    );

    res.json(singleBlog);
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
      // console.log(authToken)
      if (err) {
        res.redirect("/");
      } else {
        let user = await User.findOne({ email });

        // console.log(user);

        const count = Object.keys(req.body.blogBody).length;
        const readingTime = count;

        const title = req.body.title;
        const description = req.body.description;
        const tags = req.body.tags;
        const author = req.user.email;
        const blogBody = req.body.blogBody;

        const blog = new Blog({
          title: title,
          description: description,
          tags: tags,
          author: author,
          blogBody: blogBody,
          readingTime: readingTime,
          user: user,
        });
        // console.log(blog);
        const savedBlog = await blog.save();

        res.json({ message: "Blog created", savedBlog });
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
          // console.log(payload)

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

          console.log(`Success: ${user.email} updated a blog`);
          res.json({ message: "Blog Updated", Blog: updatedBlog });
        } else {
          // in case of error
          const realOwner = await User.findOne({ _id: singleBlog.user });
          console.log(`Edit not allowed, the owner is ${realOwner.email}`);
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
          console.log(`Success: ${user.email} deleted a blog`);
        } else {
          // in case of error
          const realOwner = await User.findOne({ _id: singleBlog.user });
          console.log(`Delete not allowed, the owner is ${realOwner.email}`);
          res.json({ message: "Unsuccesful, You are not the owner" });
        }
      }
    });
  }
});

export default authBlogRouter;
