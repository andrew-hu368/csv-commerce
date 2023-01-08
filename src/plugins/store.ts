import fp from "fastify-plugin";

import { CSVStore, IStore } from "../common/IStore";
import { User } from "../common/userSchema";
import { Item } from "../common/itemSchema";
import { Order } from "../common/orderSchema";

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<IStore<User>>(async (fastify, opts) => {
  fastify.decorate("itemStore", new CSVStore<Item>("./store/items.csv"));
  fastify.decorate("userStore", new CSVStore<User>("./store/users.csv"));
  fastify.decorate(
    "orderStore",
    new CSVStore<Order>("./store/orders.csv", ["products"])
  );
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    userStore: IStore<User>;
    orderStore: IStore<Order>;
    itemStore: IStore<Item>;
  }
}
