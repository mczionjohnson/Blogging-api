import express from "express";
import mongoose from "mongoose";
// import { connect } from 'mongodb'

import dotenv from "dotenv";
import bodyParser from "body-parser";

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
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error: ", error);
  });

// async main() => {
//   // try-catch
//   const MONGO = 'mongodb+srv://an:abc@abc-2yzxs.mongodb.net/testretryWrites=true&w=majority'
//   const client = await connect(MONGO, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true })
// }

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

// app.listen(process.env.PORT, () => {
//   console.log("server is running");
// });

// exporting the server
export default app;
