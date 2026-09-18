import { describe, expect, it } from "vitest";
import {
  clientListQuerySchema,
  clientPayloadSchema,
} from "@modules/clients/client.schema";

describe("client schemas", () => {
  it("accepts a valid client profile payload", () => {
    const payload = clientPayloadSchema.parse({
      userId: "507f1f77bcf86cd799439011",
      phone: "773612264",
      address: "Cite Gadaye",
    });

    expect(payload.phone).toBe("773612264");
  });

  it("rejects an invalid client identifier", () => {
    expect(() =>
      clientPayloadSchema.parse({
        userId: "invalid",
        phone: "773612264",
        address: "Cite Gadaye",
      }),
    ).toThrow();
  });

  it("applies pagination defaults and transforms query values", () => {
    expect(clientListQuerySchema.parse({})).toMatchObject({
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: 1,
    });
  });
});
