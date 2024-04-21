import * as authService from "../services/auth.service.js";

export const getAuthBlogs = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    page = page < 1 ? 1 : page;
    let limit = Number(req.query.limit) || 20;
    limit = limit < 1 ? 20 : limit;
    const query = req.query.q;
    const userId = req.user._id;

    const { data, meta } = await authService.getAuthBlogs(
      page,
      limit,
      query,
      userId
    );

    if (data.length === 0) {
      res.status(404).json({ message: "Invalid query" });
    } else {
      res.json({ message: "Get all blogs", data, meta });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
