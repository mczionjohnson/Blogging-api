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
        .skip(skip)
        .limit(limit);

      return { data: searchData, meta: { page, limit } };
    } else {
      // const search_data = await Blog.find({ title: query });

      // let countBlogs = await Blog.find({ state: "published" })

      let publishedBlogs = await Blog.find({ state: "published" })
        .skip(skip)
        .limit(limit);

      // const total = await countBlogs.length;

      return { data: publishedBlogs, meta: { page, limit } };
    }
  } catch (error) {
    console.log(error);
  }
};
