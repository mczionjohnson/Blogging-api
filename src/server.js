import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import logger from './logger/logger.js'

import userRouter from "./routes/auth.js";
import blogRouter from "./routes/blogs.js";
import authBlogRouter from "./routes/authBlog.js";

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));


dotenv.config();

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error: ", error);
  });


app.use("/", userRouter);
app.use("/blogs", blogRouter);
app.use("/allmyblogs", authBlogRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome!" });
});

app.all("*", (req, res) => {
  res.status(404);
  res.json({
    message: "Not found",
  });
});


// exporting the server
export default app;
