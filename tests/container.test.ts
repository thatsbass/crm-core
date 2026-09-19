import { describe, expect, it } from "vitest";
import {
  defaultServicesConfigPath,
  loadServiceContainer,
} from "@bootstrap/container";

describe("service container", () => {
  it("resolves configured services and caches instances", () => {
    const container = loadServiceContainer(defaultServicesConfigPath());
    const first = container.get("authService");
    const second = container.get("authService");

    expect(first).toBe(second);
  });

  it("reports unknown services explicitly", () => {
    const container = loadServiceContainer(defaultServicesConfigPath());

    expect(() => container.get("missingService")).toThrow(
      'Service "missingService" is not configured.',
    );
  });
});
