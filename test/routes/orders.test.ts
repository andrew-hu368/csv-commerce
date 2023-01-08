import { describe, it, vi, afterEach, expect, Mock, afterAll } from "vitest";
import Fastify from "fastify";

import { CSVStore } from "../../src/common/IStore";
import { orders } from "../mocks";
import app from "../../src/app";

vi.mock("../../src/common/IStore", () => {
  const CSVStore = vi.fn();
  CSVStore.prototype.find = vi.fn();
  CSVStore.prototype.findById = vi.fn();

  return { CSVStore };
});

describe("Orders route", () => {
  const fastify = app(Fastify({ logger: false }));

  afterEach(() => {
    vi.resetAllMocks();
  });
  afterAll(async () => {
    await fastify.close();
  });

  it("should find return the orders when found", async () => {
    (CSVStore.prototype.find as Mock).mockResolvedValueOnce(orders);

    const response = await fastify.inject({ path: "/orders", method: "GET" });
    const body = await response.json();

    expect(body).toMatchObject(orders);
  });

  it("should find return an empty array when no orders found", async () => {
    (CSVStore.prototype.find as Mock).mockResolvedValueOnce([]);

    const response = await fastify.inject({ path: "/orders", method: "GET" });
    const body = await response.json();

    expect(body).toMatchObject([]);
  });

  it("should find return the order by id", async () => {
    (CSVStore.prototype.findById as Mock).mockResolvedValueOnce(orders[0]);

    const response = await fastify.inject({
      path: `/orders/${orders[0].id}`,
      method: "GET",
    });
    const body = await response.json();

    expect(body).toMatchObject(orders[0]);
  });

  it("should find return 404 when no order found", async () => {
    (CSVStore.prototype.findById as Mock).mockResolvedValueOnce(undefined);

    const response = await fastify.inject({
      path: `/orders/${orders[0].id}`,
      method: "GET",
    });
    const body = await response.json();

    expect(body.statusCode).toBe(404);
  });
});
