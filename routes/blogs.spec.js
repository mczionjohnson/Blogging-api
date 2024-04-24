import app from "../server"; // Link to your server file
import supertest from "supertest";

const request = supertest(app);

it("Gets the home endpoint", async () => {
  // Sends GET Request to / endpoint
  const response = await request.get("/");

  expect(response.status).toBe(200);
  expect(response.body.message).toBe("Welcome!");

});

// const blogRouter = Router();

// blogRouter.get("/", userController.getAllBlogs);

// blogRouter.get("/:blogId", async (req, res) => {
//   const { blogId } = req.params;

//   try {
//     const singleBlog = await Blog.find({
//       _id: blogId,
//       state: "published",
//     });
//     if (!singleBlog) {
//       return res.json({ message: " not found" });
//     } else {
//       await Blog.findOneAndUpdate(
//         { _id: blogId },
//         { $inc: { readCount: 1 } } /* no more callback */
//       );

//       res.status(200).json({ message: "Blog found", singleBlog });
//     }
//   } catch {
//     res.status(404).json({ message: "not found" });
//   }
// });

// export default blogRouter;
