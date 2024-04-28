import app from "../server.js"; // Link to your server file
import supertest from "supertest";
import mongoose from "mongoose";
import User from "../models/userSchema.js";



const request = supertest(app);

// connect to mongoose before any other request
beforeAll(async () => {
  const url = process.env.atlasDbAlt;
  await mongoose.connect(url);
});

// save user to database
it("Should save user to database", async () => {
  let res = await request.post("/signup").send({
    firstName: "Zell",
    lastName: "Neon",
    email: "testing@gmail.com",
    password: "qwertyuiop00",
  });

  // Should search the user in the database
  const user = await User.findOne({ email: "testing@gmail.com" });
  expect(user.email).toBeTruthy();

  // Ensures response contains email
  expect(res.body.savedUser.email).toBeTruthy();
  // console.log(res.body.savedUser.email);

// login user and get blogs
const userId = res.body.savedUser._id
// console.log(userId)
   res = await request.post("/login").send({
    email: "testing@gmail.com",
    password: "qwertyuiop00",
  });

  // Should get a token after login
  expect(res.body.token).toBeTruthy();

  const token = res.body.token;
  // console.log(token)
  res = await request
    .get("/allmyblogs")
    .set('Authorization', `Bearer ${token}`) //set header for this test
    .set('Content-Type',  'application/json') //set header for this test

    // .send({
    // user: "testing@gmail.com"
    // })
    .expect('Content-Type', /json/)
    .expect(200)
// .expect(res.body).toBetruthy()
console.log(res.body)

  // console.log(res);

  await User.deleteMany();
});

// login user and get blogs
// it("Should login the user", async () => {
//   const res = await request.post("/login").send({
//     email: "testing@gmail.com",
//     password: "qwertyuiop00",
//   });

//   // Should get a token after login
//   expect(res.body.token).toBeTruthy();
//   // console.log(res.body.token)
//   // global.push(res.body.token)
//   // console.log(global)

//   const token = res.body.token;
//   res = await request
//     .get("/allmyblogs")
//     .set('Authorization', token) //set header for this test
//     .set('Content-Type',  'application/json') //set header for this test
//     .send({
//     userId: req.user._id;
//     email: "testing@gmail.com"
//     })
//     .expect('Content-Type', /json/)
//     .expect(500)
//     .expect(anErrorCode('50040'))
//     .end(done);

//   console.log(res);

//   await User.deleteMany();
// });

// it("get auth blogs", async () => {
//   const token = res.body.token
//   const res = await request.get("/allmyblogs").send(

// req.setHeader('Authorization', 'Bearer ' + token),
// req.setHeader('Content-Type', 'application/json')

// )

//   await User.deleteMany();
// })

// Cleans up database between each test
// afterEach(async () => {
//   await User.deleteMany();
// });

afterAll(async () => {
  // await User.deleteMany();
  mongoose.disconnect();
});
