import { describe, it, vi, afterEach, expect, Mock } from "vitest";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

import { CSVStore } from "../../src/common/IStore";
import { itemsToString, orders } from "../mocks";

vi.mock("node:fs", () => ({
  createReadStream: vi.fn(),
}));

describe("CSVStore", () => {
  const store = new CSVStore("your-path");

  const itemsReadable = `id;name;description;price;currency;quantity\n${itemsToString[0].id};${itemsToString[0].name};${itemsToString[0].description};${itemsToString[0].price};${itemsToString[0].currency};${itemsToString[0].quantity}\n${itemsToString[1].id};${itemsToString[1].name};${itemsToString[1].description};${itemsToString[1].price};${itemsToString[1].currency};${itemsToString[1].quantity}\n`;

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return the expected item", async () => {
    (createReadStream as Mock).mockReturnValueOnce(
      Readable.from(itemsReadable)
    );
    const foundItem = await store.findById(itemsToString[0].id);
    expect(foundItem).toMatchObject(itemsToString[0]);
  });

  it("should return undefined when not found", async () => {
    (createReadStream as Mock).mockReturnValueOnce(
      Readable.from(itemsReadable)
    );
    const foundItem = await store.findById("any-id");
    expect(foundItem).toBe(undefined);
  });

  it("should return all items", async () => {
    (createReadStream as Mock).mockReturnValueOnce(
      Readable.from(itemsReadable)
    );
    const foundItems = await store.find({});
    expect(foundItems).toMatchObject(itemsToString);
  });

  it("should return apply filters on items", async () => {
    (createReadStream as Mock).mockReturnValueOnce(
      Readable.from(itemsReadable)
    );
    const foundItems = await store.find({ name: itemsToString[0].name });
    expect(foundItems).toMatchObject([itemsToString[0]]);
  });

  it("should return all items if filter exists but it is undefined", async () => {
    (createReadStream as Mock).mockReturnValueOnce(
      Readable.from(itemsReadable)
    );
    const foundItems = await store.find({ name: undefined });
    expect(foundItems).toMatchObject(itemsToString);
  });

  it("should parse JSON string", async () => {
    const ordersReadable = `id;userId;datetime;products\n${Object.values(
      orders[0]
    )
      .map((val) => {
        if (Array.isArray(val)) {
          return JSON.stringify(val);
        }
        return val;
      })
      .join(";")}`;
    const store = new CSVStore("your-path", ["products"]);
    (createReadStream as Mock).mockReturnValueOnce(
      Readable.from(ordersReadable)
    );
    const foundOrders = await store.find({});
    expect(foundOrders).toMatchObject([orders[0]]);
  });
});
