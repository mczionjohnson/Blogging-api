import app from "../server.js"; // Link to your server file
import supertest from "supertest";
import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Blog from "../models/blogSchema.js";

const request = supertest(app);

// CONNECT to mongoose before any other request
beforeAll(async () => {
  const url = process.env.atlasDbAlt;
  await mongoose.connect(url);
});

// It should SAVE a user to database
it("Should save user to database", async () => {
  let res = await request.post("/signup").send({
    firstName: "Zell",
    lastName: "Neon",
    email: "testing@gmail.com",
    password: "qwertyuiop00",
  });

  // It should SEARCH a user in the database
  const user = await User.findOne({ email: "testing@gmail.com" });
  expect(user.email).toBeTruthy();

  // Ensures response contains email
  expect(res.body.savedUser.email).toBeTruthy();
  // console.log(res.body.savedUser.email);

  // It should LOGIN a user
  const userId = res.body.savedUser._id;
  // console.log(userId)
  res = await request.post("/login").send({
    email: "testing@gmail.com",
    password: "qwertyuiop00",
  });

  // Should get a TOKEN after login
  expect(res.body.token).toBeTruthy();

  const token = res.body.token;
  // console.log(token)

  // should GET all protected blogs
  res = await request
    .get("/allmyblogs")
    .set("Authorization", `Bearer ${token}`) //set header for this test
    .set("Content-Type", "application/json") //set header for this test
  .expect("Content-Type", /json/)
  .expect(200)
  expect(res.body).toBeTruthy();
  // // console.log(res.body)

// It should POST a blog to a protected route
  res = await request
  .post("/allmyblogs")
  .set("Authorization", `Bearer ${token}`) //set header for this test
  .set("Content-Type", "application/json") //set header for this test
.expect("Content-Type", /json/)
.expect(200)
.send({
  "title": "Pomeriggiato",
  "description": "How to make a Italian dish",
  "tags": "veg italian pasta-not-broken dish",
  "blogBody": "Step 1: boil water"
})
expect(res.body.savedBlog).toBeTruthy();
// console.log(res.body)

// It should GET a protected blog
let singleBlog =  res.body.savedBlog._id
// console.log(res.body.savedBlog._id)

res = await request
.get(`/allmyblogs/${singleBlog}`)
.set("Authorization", `Bearer ${token}`) //set header for this test
.set("Content-Type", "application/json") //set header for this test
.expect("Content-Type", /json/)
.expect(200)


expect(res.body.Blog).toBeTruthy();
// console.log(res.body)

// It should PATCH a protected blog
res = await request
.patch(`/allmyblogs/${singleBlog}`)
.set("Authorization", `Bearer ${token}`) //set header for this test
.set("Content-Type", "application/json") //set header for this test
.expect("Content-Type", /json/)
.expect(200)
.send({
"title": "Gelato",
"description": "How to make a gelato",
"tags": "italian dessert dish",
"state": "published",
"blogBody": "Step 1: prepare a cone"
})

expect(res.body.Blog).toBeTruthy();
// console.log(res.body)

// it should DELETE a protected blog

// res = await request
// .delete(`/allmyblogs/${singleBlog}`)
// .set("Authorization", `Bearer ${token}`) //set header for this test
// .set("Content-Type", "application/json") //set header for this test
// .expect("Content-Type", /json/)
// .expect(200)

// expect(res.body.Blog).toBeTruthy();
// console.log(res.body)

  await User.deleteMany();
  await Blog.deleteMany();
});


afterAll(async () => {
  mongoose.disconnect();
});
