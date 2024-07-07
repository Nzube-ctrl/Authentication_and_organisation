import request from "supertest";
import app from "../src/index.js";
import sequelize from "../src/config/database.js";
// import { User, Organisation } from "../src/models/associations.js";

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const res = await request(app).post("/api/users/register").send({
    firstName: "Helen",
    lastName: "Uwakwe",
    email: "helen.uwakwe@example.com",
    password: "password123",
    phone: "1234567890",
  });
  token = res.body.data.accessToken;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Organisation Endpoints", () => {
  it("should get all organisations for the logged in user", async () => {
    const res = await request(app)
      .get("/api/organisations")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.organisations).toHaveLength(1);
  });

  it("should create a new organisation", async () => {
    const res = await request(app)
      .post("/api/organisations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Henrich Corp",
        description: "A company founded by Henrich group",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("name", "Henrich corp");
  });

  it("should get a single organisation by id", async () => {
    const orgRes = await request(app)
      .get("/api/organisations")
      .set("Authorization", `Bearer ${token}`);
    const orgId = orgRes.body.data.organisations[0].orgId;

    const res = await request(app)
      .get(`/api/organisations/${orgId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("orgId", orgId);
  });

  it("should add a user to an organisation", async () => {
    const userRes = await request(app).post("/api/users/register").send({
      firstName: "Richard",
      lastName: "Uwakwe",
      email: "richard.uwakwe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    const orgRes = await request(app)
      .get("/api/organisations")
      .set("Authorization", `Bearer ${token}`);
    const orgId = orgRes.body.data.organisations[0].orgId;

    const res = await request(app)
      .post(`/api/organisations/${orgId}/addUser`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: userRes.body.data.user.userId,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "User added to organisation successfully"
    );
  });
});
