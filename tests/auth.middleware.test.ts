import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { authenticate } from "@infrastructure/http/auth.middleware";
import { UserRole } from "@modules/users/user.types";
import { ENV } from "@config/env";

function createTestApp(token?: string) {
  const app = express();
  app.get("/protected", authenticate, (req, res) => {
    res.json(req.user);
  });
  app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(error.name === "UnauthorizedError" ? 401 : 500).json({ message: error.message });
  });
  return token ? request(app).get("/protected").set("Authorization", `Bearer ${token}`) : request(app).get("/protected");
}

describe("JWT authentication middleware", () => {
  it("rejects requests without a token", async () => {
    const response = await createTestApp();

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token d'authentification requis.");
  });

  it("accepts a valid token and exposes the authenticated user", async () => {
    const token = jwt.sign(
      { sub: "507f1f77bcf86cd799439011", email: "admin@example.com", role: UserRole.ADMIN },
      ENV.JWT_SECRET,
    );
    const response = await createTestApp(token);

    expect(response.status).toBe(200);
    expect(response.body.role).toBe(UserRole.ADMIN);
  });
});
