import app from "../server"; // Link to your server file
import supertest from "supertest";

const request = supertest(app);

it("Gets the home endpoint", async () => {
  // Sends GET Request to / endpoint
  const response = await request.get("/");

  expect(response.status).toBe(200);
  expect(response.body.message).toBe("Welcome!");
});


