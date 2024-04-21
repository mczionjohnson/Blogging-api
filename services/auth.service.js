import Blog from "../models/blogSchema.js";

export const getAuthBlogs = async (
  page = 1,
  limit = 20,
  query = null,
  userId
) => {
  try {
    const skip = (page - 1) * limit;

    const filter = query ? { name: { $regex: query, $options: "i" } } : {};

    const forTotal = await Blog.find({ user: userId });
    let authBlogs = await Blog.find({ user: userId }).skip(skip).limit(limit);

    const total = forTotal.length;
    // const total = await Blog.countDocuments(filter);


    return { data: authBlogs, meta: { page, limit, total } };
  } catch (error) {
    console.log(error);
  }
};
