import app from "../server.js"; // Link to your server file
import supertest from "supertest";
import mongoose from "mongoose";
import User from "../models/userSchema.js";

const request = supertest(app);

// connect to mongoose before any other request
beforeAll(async () => {
  const url = process.env.TEST_DATABASE;
  await mongoose.connect(url);
});

it("Should save user to database", async () => {
  const res = await request.post("/signup").send({
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
  // logger.info(res.body.savedUser.email)
});

// Cleans up database between each test
afterEach(async () => {
  await User.deleteMany();
});

afterAll(() => {
  mongoose.disconnect();
});
