import request from "supertest";
import app from "../src/index.js";
import sequelize from "../src/config/database.js";
// import { User, Organisation } from "../src/models/associations.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Auth Endpoints", () => {
  it("should register user successfully with default organisation", async () => {
    const res = await request(app).post("/api/users/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.user).toHaveProperty("firstName", "John");
    expect(res.body.data).toHaveProperty("accessToken");
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post("/api/users/register").send({
      firstName: "Jane",
      email: "jane.doe@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should login user successfully", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("accessToken");
  });

  it("should fail if login credentials are invalid", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "john.doe@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Authentication failed");
  });
});
