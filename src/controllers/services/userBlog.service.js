import Blog from "../../models/blogSchema.js";
import logger from "../../logger/logger.js";

export const getAuthBlogs = async (query = null, userId) => {
  try {
    const skip = (page - 1) * limit;

    // let authBlogs = await Blog.find({ user: userId }).skip(skip).limit(limit);

    if (query != {}) {
      const searchConditionOne = query
        ? { body: { $regex: query, $options: "i" } }
        : {};
      const searchConditionFour = query
        ? { state: { $regex: query, $options: "i" } }
        : {};

      const searchData = await Blog.find({
        $or: [
          { $and: [searchConditionOne, { user: userId }] },
          { $and: [searchConditionFour, { user: userId }] },
        ],
      })
      .sort({ readCount: -1, readingTime: 1, timestamp: -1 });
      // .skip(skip)
      // .limit(limit)

      return { data: searchData };
    }
  } catch (error) {
    logger.error(error);
  }
};
