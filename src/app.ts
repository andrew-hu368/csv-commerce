import { FastifyInstance } from "fastify";

import auth from "./plugins/auth";
import sensible from "./plugins/sensible";
import store from "./plugins/store";
import items from "./routes/items";
import orders from "./routes/orders";
import users from "./routes/users";

const app = (fastify: FastifyInstance): FastifyInstance => {
  fastify.register(auth);
  fastify.register(sensible);
  fastify.register(store);
  fastify.register(items, { prefix: "items" });
  fastify.register(orders, { prefix: "orders" });
  fastify.register(users, { prefix: "users" });

  return fastify;
};

export default app;
export { app };
