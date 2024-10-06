import { Router } from "express";
// import logger from '../logger/logger.js'


import Blog from "../models/blogSchema.js";
import * as userController from "../controllers/blog.controller.js";

const clientRouter = Router();

clientRouter.get("/", userController.getAllBlogs);

// move to userController
clientRouter.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;

  try {
    const singleWhistle = await Blog.find({
      _id: blogId,
      state: "published",
    });
    if (!singleWhistle) {
      return res.json({ message: " not found" });
    } else {
      await Blog.findOneAndUpdate(
        { _id: blogId },
        { $inc: { readCount: 1 } } /* no more callback */
      );

      res.status(200).json({ message: "Whistles found", singleWhistle });
    // logger.info(`Success: ${user.email} viewed a blog`);

    }
  } catch {
    res.status(404).json({ message: "not found" });
  }
});

export default clientRouter;
