
import logger from '../logger/logger.js'


import User from "../models/userSchema.js";
import Jwt from "jsonwebtoken";



export const authLogin = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

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
  if (!firstName) {
    return res.status(400).json({ message: "Enter first name" });
  }
  if (!lastName) {
    return res.status(400).json({ message: "Enter last name" });
  }

  const payload = {};
  if (firstName) {
    payload.firstName = firstName;
  }
  if (lastName) {
    payload.lastName = lastName;
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

export const authSignup = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    return res.status(400).json({ message: "Enter email" });
  }
  if (!password) {
    return res.status(400).json({ message: "Enter password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!user.isValidPassword(password)) {
    return res.status(401).json({ message: "Password is incorrect" });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  const token = Jwt.sign(
    {
      email: user.email,
      _id: user._id,
    },
    JWT_SECRET,
    { expiresIn: "1hr" }
  );
  //   logger.info(token);
  return res.json({ token });
};


