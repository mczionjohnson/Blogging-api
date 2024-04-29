import * as userService from "../services/user.service.js";

export const getAllBlogs = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    page = page < 1 ? 1 : page;
    let limit = Number(req.query.limit) || 20;
    limit = limit < 1 ? 20 : limit;
    const query = req.query.q;

    const { data, meta } = await userService.getAllBlogs(page, limit, query);
    res.status(200).json({ message: "Get all blogs", data, meta });
    // console.log("Success: unregistered user viewed all blog");

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
