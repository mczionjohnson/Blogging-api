import Blog from "../../models/blogSchema.js";
// import redisClient from "../../integrations/redis.js";

import logger from "../../logger/logger.js";

export const getAllBlogs = async (page = 1, limit = 20, query) => {
  try {
    const skip = (page - 1) * limit;

    if (query != null) {
      const searchConditionOne = query
        ? { title: { $regex: query, $options: "i" } }
        : {};
      const searchConditionTwo = query
        ? { tags: { $regex: query, $options: "i" } }
        : {};
      const searchConditionThree = query
        ? { author: { $regex: query, $options: "i" } }
        : {};

      const searchData = await Blog.find({
        $or: [
          { $and: [searchConditionOne, { state: "published" }] },
          { $and: [searchConditionTwo, { state: "published" }] },
          { $and: [searchConditionThree, { state: "published" }] },
        ],
      })
        .sort({ readCount: -1, readingTime: 1, timestamps: -1 })
        .skip(skip)
        .limit(limit);

      return { data: searchData, meta: { page, limit } };
    } else {
  
      // // set cacheKey and check for cache
      // const cacheKey = "publishedBlog";

      // // get data from database
      // const value = await redisClient.get(cacheKey);

      // // check for cache miss
      // if (value != null) {
      //   console.log("returning data from cache");
      //   return { data: JSON.parse(value), meta: { page, limit } };
      // }

    // cache miss is true, get data from DB
      // console.log("getting data from DB");
      let publishedBlogs = await Blog.find({ state: "published" })
        .sort({ readCount: -1, readingTime: 1, timestamps: -1 })
        .skip(skip)
        .limit(limit);


      // // set cache with expirition of 1 minute
      // await redisClient.setEx(cacheKey, 1 * 60, JSON.stringify(publishedBlogs));
      return { data: publishedBlogs, meta: { page, limit } };
    }
  } catch (error) {
    logger.error(error);
  }
};
