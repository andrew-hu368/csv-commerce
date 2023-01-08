import { describe, it, vi, afterEach, expect, Mock, afterAll } from "vitest";
import Fastify from "fastify";

import { CSVStore } from "../../src/common/IStore";
import { users } from "../mocks";
import app from "../../src/app";

vi.mock("../../src/common/IStore", () => {
  const CSVStore = vi.fn();
  CSVStore.prototype.find = vi.fn();
  CSVStore.prototype.findById = vi.fn();

  return { CSVStore };
});

describe("Users route", () => {
  const fastify = app(Fastify({ logger: false }));

  afterEach(() => {
    vi.resetAllMocks();
  });
  afterAll(async () => {
    await fastify.close();
  });

  it("should find return the users when found", async () => {
    (CSVStore.prototype.find as Mock).mockResolvedValueOnce(users);

    const response = await fastify.inject({
      path: "/users",
      method: "GET",
      headers: {
        "x-api-key": "your-secret-test-api-key",
      },
    });
    const body = await response.json();

    expect(body).toMatchObject(users);
  });

  it("should find return an empty array when no users found", async () => {
    (CSVStore.prototype.find as Mock).mockResolvedValueOnce([]);

    const response = await fastify.inject({
      path: "/users",
      method: "GET",
      headers: {
        "x-api-key": "your-secret-test-api-key",
      },
    });
    const body = await response.json();

    expect(body).toMatchObject([]);
  });

  it("should find return the user by id", async () => {
    (CSVStore.prototype.findById as Mock).mockResolvedValueOnce(users[0]);

    const response = await fastify.inject({
      path: `/users/${users[0].id}`,
      method: "GET",
      headers: {
        "x-api-key": "your-secret-test-api-key",
      },
    });
    const body = await response.json();

    expect(body).toMatchObject(users[0]);
  });

  it("should find return 404 when no user found", async () => {
    (CSVStore.prototype.findById as Mock).mockResolvedValueOnce(undefined);

    const response = await fastify.inject({
      path: `/users/${users[0].id}`,
      method: "GET",
      headers: {
        "x-api-key": "your-secret-test-api-key",
      },
    });
    const body = await response.json();

    expect(body.statusCode).toBe(404);
  });

  it("should find return 401 when no auth key", async () => {
    const response = await fastify.inject({
      path: `/users/${users[0].id}`,
      method: "GET",
    });
    const body = await response.json();

    expect(body.statusCode).toBe(401);
  });

  it("should find return 401 when invalid key", async () => {
    const response = await fastify.inject({
      path: `/users/${users[0].id}`,
      method: "GET",
      headers: {
        "x-api-key": "invalid-key",
      },
    });
    const body = await response.json();

    expect(body.statusCode).toBe(401);
  });
});
