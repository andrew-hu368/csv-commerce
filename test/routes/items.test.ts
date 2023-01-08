import { describe, it, vi, afterEach, expect, Mock, afterAll } from "vitest";
import Fastify from "fastify";

import { CSVStore } from "../../src/common/IStore";
import { items } from "../mocks";
import app from "../../src/app";

vi.mock("../../src/common/IStore", () => {
  const CSVStore = vi.fn();
  CSVStore.prototype.find = vi.fn();
  CSVStore.prototype.findById = vi.fn();

  return { CSVStore };
});

describe("Items route", () => {
  const fastify = app(Fastify({ logger: false }));

  afterEach(() => {
    vi.resetAllMocks();
  });
  afterAll(async () => {
    await fastify.close();
  });

  it("should find return the items when found", async () => {
    (CSVStore.prototype.find as Mock).mockResolvedValueOnce(items);

    const response = await fastify.inject({ path: "/items", method: "GET" });
    const body = await response.json();

    expect(body).toMatchObject(items);
    expect(CSVStore.prototype.find).toBeCalledWith({ name: undefined });
  });

  it("should find return an empty array when no items found", async () => {
    (CSVStore.prototype.find as Mock).mockResolvedValueOnce([]);

    const response = await fastify.inject({ path: "/items", method: "GET" });
    const body = await response.json();

    expect(body).toMatchObject([]);
  });

  it("should find return the item by id", async () => {
    (CSVStore.prototype.findById as Mock).mockResolvedValueOnce(items[0]);

    const response = await fastify.inject({
      path: `/items/${items[0].id}`,
      method: "GET",
    });
    const body = await response.json();

    expect(body).toMatchObject(items[0]);
  });

  it("should find return 404 when no item found", async () => {
    (CSVStore.prototype.findById as Mock).mockResolvedValueOnce(undefined);

    const response = await fastify.inject({
      path: `/items/${items[0].id}`,
      method: "GET",
    });
    const body = await response.json();

    expect(body.statusCode).toBe(404);
  });

  it("should find return the items and apply filters when found ", async () => {
    (CSVStore.prototype.find as Mock).mockResolvedValueOnce(items);

    await fastify.inject({
      path: "/items?name=Table",
      method: "GET",
    });

    expect(CSVStore.prototype.find).toBeCalledWith({ name: "Table" });
  });
});
