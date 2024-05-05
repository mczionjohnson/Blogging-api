import express from "express";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import db from "./database/connection.js";
import indexRouter from "./routes/auth.js";
import blogRouter from "./routes/userBlog.js";
import authBlogRouter from "./routes/authBlog.js";

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

db();

app.use("/", indexRouter);
app.use("/blogs", blogRouter);
app.use("/allmyblogs", authBlogRouter);



app.all("*", (req, res) => {
  res.status(404);
  res.json({
    message: "Not found",
  });
});

// exporting the server
export default app;
