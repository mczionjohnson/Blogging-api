import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
  title: {
    type: "string",
  },
  description: {
    type: "string",
  },
  author: {
    type: "string",
  },

  // mongoose.Schema.Types.ObjectId tells model that users is another table in the collection
  // the ref states the table
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  state: {
    type: String,
    default: "draft",
    enum: ["draft", "published"],
  },
  tags: {
    type: "string",
  },
  blogBody: {
    type: String,
    required: true,
  },
  readCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,

}
}, {timestamps: true }

);
//you missed this line, this will search in all fields
// postSchema.index({'$**': 'text'});
// or if you need to search in specific field then replace it by:
blogSchema.index({title: 'text'});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
