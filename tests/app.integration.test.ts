import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "@/app";

describe("application routes", () => {
  it("serves the OpenAPI document", async () => {
    const response = await request(app).get("/docs/json");

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe("3.0.3");
    expect(response.body.paths["/auth/login"]).toBeDefined();
    expect(response.body.paths["/users/admins"]).toBeDefined();
  });

  it("returns unauthorized for protected client routes", async () => {
    const response = await request(app).get("/v1/api/clients");

    expect(response.status).toBe(401);
  });

  it("returns unauthorized for administrator creation without a JWT", async () => {
    const response = await request(app)
      .post("/v1/api/users/admins")
      .send({
        name: "Second Administrator",
        email: "admin2@example.com",
        password: "StrongPassword123!",
      });

    expect(response.status).toBe(401);
  });
});
