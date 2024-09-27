import * as authService from "./services/userBlog.service.js";


export const getAuthBlogs = async (req, res) => {
  try {

    const query = req.query.q;
    const userId = req.user._id;
    const email = req.user.email;

    const { data, meta } = await authService.getAuthBlogs(
      query,
      userId
    );

    // if (data.length === 0) {
    //   res.status(404).json({ message: "Invalid query" });
    // }
    // else {

    // logger.info(`Success: ${email} viewed all blog`);
    res.status(200).json({ message: "Get all blogs", data });


    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
