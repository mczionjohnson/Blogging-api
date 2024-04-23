import Blog from "../models/blogSchema.js";

export const getAllBlogs = async (page = 1, limit = 20, query) => {
  try {
    const skip = (page - 1) * limit;

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

      const searchData = await Blog.find({
        $or: [
          { $and: [searchConditionOne, { state: "published" }] },
          { $and: [searchConditionTwo, { state: "published" }] },
          { $and: [searchConditionThree, { state: "published" }] },
        ],
      })
        .sort({ readCount: 1, readingTime: -1, timestamps: 1 })
        .skip(skip)
        .limit(limit);

      return { data: searchData, meta: { page, limit } };
    } else {
      let publishedBlogs = await Blog.find({ state: "published" })
        .sort({ readCount })
        .skip(skip)
        .limit(limit);

      return { data: publishedBlogs, meta: { page, limit } };
    }
  } catch (error) {
    console.log(error);
  }
};
