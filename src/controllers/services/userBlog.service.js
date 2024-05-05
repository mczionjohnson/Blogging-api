import Blog from "../../models/blogSchema.js";
import logger from '../../logger/logger.js'

export const getAuthBlogs = async (
  page = 1,
  limit = 20,
  query = null,
  userId
) => {
  try {
    const skip = (page - 1) * limit;

    // let authBlogs = await Blog.find({ user: userId }).skip(skip).limit(limit);

    if (query != {}) {
      const searchConditionOne = query
        ? { title: { $regex: query, $options: "i" } }
        : {};
      const searchConditionTwo = query
        ? { tags: { $regex: query, $options: "i" } }
        : {};
      const searchConditionThree = query
        ? { author: { $regex: query, $options: "i" } }
        : {}; 
        const searchConditionFour = query
        ? { state: { $regex: query, $options: "i" } }
        : {};

      const searchData = await Blog.find({
        $or: [
          { $and: [searchConditionOne, { user: userId }] },
          { $and: [searchConditionTwo, { user: userId }] },
          { $and: [searchConditionThree, { user: userId }] },
          { $and: [searchConditionFour, { user: userId }] },

        ],
      })
        .skip(skip)
        .limit(limit)
        .sort({ readCount: -1, readingTime: 1, timestamp: -1 });
        // skip
        // limit
        // sort

      return { data: searchData, meta: { page, limit } };
    }
  } catch (error) {
    logger.error(error);
  }
};
