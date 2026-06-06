import { describe, it, expect } from "vite-plus/test";
import programs from "../src/data/programs.json";

describe("Programs Data Schema", () => {
  it("should be an array of programs", () => {
    expect(Array.isArray(programs)).toBe(true);
    expect(programs.length).toBeGreaterThan(0);
  });

  it("each program should have required fields with correct types", () => {
    programs.forEach((program, index) => {
      // Basic required string fields
      expect(typeof program.id, `Program at index ${index} missing 'id'`).toBe("string");
      expect(typeof program.agency, `Program '${program.id}' missing 'agency'`).toBe("string");
      expect(typeof program.name, `Program '${program.id}' missing 'name'`).toBe("string");
      expect(typeof program.category, `Program '${program.id}' missing 'category'`).toBe("string");
      expect(typeof program.description, `Program '${program.id}' missing 'description'`).toBe(
        "string",
      );
      expect(
        typeof program.processing_time,
        `Program '${program.id}' missing 'processing_time'`,
      ).toBe("string");

      // URL validation (basic check)
      expect(typeof program.official_url, `Program '${program.id}' missing 'official_url'`).toBe(
        "string",
      );
      expect(program.official_url.startsWith("http")).toBe(true);

      // Arrays validation
      expect(
        Array.isArray(program.target_audience),
        `Program '${program.id}' target_audience must be an array`,
      ).toBe(true);
      expect(program.target_audience.length).toBeGreaterThan(0);

      expect(Array.isArray(program.steps), `Program '${program.id}' steps must be an array`).toBe(
        true,
      );
      expect(program.steps.length).toBeGreaterThan(0);

      expect(
        Array.isArray(program.requirements),
        `Program '${program.id}' requirements must be an array`,
      ).toBe(true);
      expect(program.requirements.length).toBeGreaterThan(0);

      expect(Array.isArray(program.tags), `Program '${program.id}' tags must be an array`).toBe(
        true,
      );
      expect(program.tags.length).toBeGreaterThan(0);
    });
  });
});
