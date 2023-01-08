import { createReadStream } from "node:fs";
import { promises } from "node:stream";
import csvParser from "csv-parser";

export interface IStore<T extends { id: string | number }> {
  findById(id: unknown): Promise<T | undefined>;
  find(where: unknown): Promise<T[]>;
  create(data: unknown): Promise<T>;
  update(data: unknown, where: unknown): Promise<T[]>;
  delete(id: unknown): Promise<T>;
}

export class CSVStore<T extends { id: string | number }> implements IStore<T> {
  private readonly filename: string;
  private readonly jsonFields: string[] | undefined;

  constructor(filename: string, jsonFields?: string[]) {
    this.filename = filename;
    this.jsonFields = jsonFields;
  }

  async findById(id: string | number): Promise<T | undefined> {
    let item: undefined | T;
    const readable = createReadStream(this.filename);
    const parser = csvParser({ separator: ";" });
    parser.on("data", (chunk: T) => {
      if (chunk.id === id) {
        item = chunk;
        readable.destroy();
      }
    });

    try {
      await promises.pipeline(readable, parser);
    } catch (err) {
      if ((err as Error).message !== "Premature close") {
        throw err;
      }
    }

    this.parseStringifiedFields(item);

    return item;
  }

  async find(where: Record<string, any>): Promise<T[]> {
    let items: T[] = [];
    const readable = createReadStream(this.filename);
    const parser = csvParser({ separator: ";" });

    parser.on("data", (chunk: Record<string, any>) => {
      const keys = Object.keys(where).filter((key) => where[key] !== undefined);

      let hasTheSameKeyValues = true;
      for (const key of keys) {
        hasTheSameKeyValues = chunk[key] === where[key];

        if (!hasTheSameKeyValues) {
          break;
        }
      }

      if (hasTheSameKeyValues) {
        items.push(chunk as T);
      }
    });

    await promises.pipeline(readable, parser);

    items.forEach((item) => this.parseStringifiedFields(item));

    return items;
  }
  create(data: unknown): Promise<T> {
    throw new Error("Method not implemented.");
  }
  update(data: unknown, where: unknown): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  delete(id: unknown): Promise<T> {
    throw new Error("Method not implemented.");
  }

  private parseStringifiedFields(item?: T) {
    if (item && this.jsonFields) {
      this.jsonFields.forEach((field) => {
        (item as Record<string, any>)[field] = JSON.parse(
          (item as Record<string, any>)[field]
        );
      });
    }
  }
}
