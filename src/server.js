import express from "express";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import helmet from "helmet";

import limiter from "./config/rateLimiter.js"
import db from "./database/connection.js";
import httpLogger from "./logger/httpLogger.js";

import indexRouter from "./routes/index.js";
import blogRouter from "./routes/Blog.js";
import authBlogRouter from "./routes/userBlog.js";
import redisClient from "./integrations/redis.js"

const app = express();

// Apply the rate limiting middleware to all requests globally
// app.use(limiter);

//add secuirty
app.use(helmet());

// for morgan
app.use(httpLogger);



app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

db();
redisClient.connect()

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
