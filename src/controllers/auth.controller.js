// import logger from "../logger/logger.js";

import User from "../models/userSchema.js";
import Jwt from "jsonwebtoken";

export const authSignup = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  const checkUser = await User.findOne({ email });
  if (checkUser) {
    res.status(400);
    res.json("User already exists");
    return;
  }

  if (!email) {
    return res.status(400).json({ message: "Enter email" });
  }
  if (!password) {
    return res.status(400).json({ message: "Enter password" });
  }
  if (!username) {
    return res.status(400).json({ message: "Enter  username" });
  }

  const payload = {};
  if (username) {
    payload.username = username;
  }
  if (email) {
    payload.email = email;
  }
  if (password) {
    payload.password = password;
  }
  // logger.info(payload);

  const user = new User({
    ...payload,
  });
  const savedUser = await user.save();
  // logger.info(savedUser);

  res.json({ message: "Success", savedUser });
};

export const authLogin = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    return res.status(400).json({ message: "Enter email" });
  }
  if (!password) {
    return res.status(400).json({ message: "Enter password" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    try {
      const checkPassword = await user.isValidPassword(password);

      if (checkPassword == false) {
        return res.status(401).json({ message: "Password is incorrect" });
      } else {
        const secret = process.env.JWT_SECRET;

        const token = Jwt.sign(
          {
            email: user.email,
            _id: user._id,
          },
          secret,
          { expiresIn: "1hr" }
        );

        // add job to the queue
        // const data = {
        //   jobId: Math.random() * 10000,
        //   jobName: 'SendLoginAlert',
        //   email: user.email,
        // }
        // Producer(data); // creates data in queue
        // console.log("job added to the queue")

        res.cookie("jwt", token, { httpOnly: true });

        return res.json({
          message:
            "logged in successfully, token in cookies, expires in an hour",
        });
      }
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
