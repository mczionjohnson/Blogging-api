import * as authService from "./services/userBlog.service.js";
import User from "../models/userSchema.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = req.body.user;
    const id = user._id;

    // returns profile excluding password
    const userProfile = await User.findOne({ _id: id }).select(
      "-password -_id -__v"
    );

    if (userProfile != null) {
      return res.status(200).json({
        message: "Your Profile",
        userProfile,
      });
    } else {
      return res.status(500).json({ message: "internal error" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAuthBlogs = async (req, res) => {
  try {
    const query = req.query.q;
    // const userId = req.user._id;
    const user = req.body.user;
    const userId = user._id;
    // const email = req.user.email;

    const { data } = await authService.getAuthBlogs(query, userId);

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
