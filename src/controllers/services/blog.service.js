import Blog from "../../models/blogSchema.js";
// import redisClient from "../../integrations/redis.js";

import logger from "../../logger/logger.js";

export const getAllBlogs = async (query) => {
  try {
    // const skip = (page - 1) * limit;

    if (query != null) {
      const searchConditionOne = query
        ? { body: { $regex: query, $options: "i" } }
        : {};

      const searchData = await Blog.find({
        $or: [{ $and: [searchConditionOne, { state: "published" }] }],
      }).sort({ readCount: -1, readingTime: 1, timestamps: -1 });
      // .skip(skip)
      // .limit(limit);

      return { data: searchData };
    } else {
      let publishedBlogs = await Blog.find({ state: "published" }).sort({
        readCount: -1,
        readingTime: 1,
        timestamps: -1,
      });
      // .skip(skip)
      // .limit(limit);

      return { data: publishedBlogs };
    }
  } catch (error) {
    logger.error(error);
  }
};
