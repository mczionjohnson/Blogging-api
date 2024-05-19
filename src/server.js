import express from "express";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import db from "./database/connection.js";
import indexRouter from "./routes/index.js";
import blogRouter from "./routes/Blog.js";
import authBlogRouter from "./routes/userBlog.js";

const app = express();

// Defaults to in-memory store.
// You can use redis or any other store.
const limiter = rateLimit({
  windowMs: 0.5 * 60 * 1000, // half a minute
  max: 4, // Limit each IP to 4 requests per `window` (here, per half a minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//add secuirty
app.use(helmet());

// Apply the rate limiting middleware to all requests
app.use(limiter);

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
