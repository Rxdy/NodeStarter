import request from "supertest";
import app from "../src/app";

describe("GET /users/", () => {
  it("", async () => {
    const reponse = await request(app).get("/users/");
    expect(response.status).toBe(200);
    expect(response.body);
  });
});
