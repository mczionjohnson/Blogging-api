import { Router } from "express";
import logger from '../logger/logger.js'


import Blog from "../models/blogSchema.js";
import * as userController from "../controllers/blog.controller.js";

const blogRouter = Router();

blogRouter.get("/", userController.getAllBlogs);

// move to userController
blogRouter.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;

  try {
    const singleBlog = await Blog.find({
      _id: blogId,
      state: "published",
    });
    if (!singleBlog) {
      return res.json({ message: " not found" });
    } else {
      await Blog.findOneAndUpdate(
        { _id: blogId },
        { $inc: { readCount: 1 } } /* no more callback */
      );

      res.status(200).json({ message: "Blog found", singleBlog });
    // logger.info(`Success: ${user.email} viewed a blog`);

    }
  } catch {
    res.status(404).json({ message: "not found" });
  }
});

export default blogRouter;
