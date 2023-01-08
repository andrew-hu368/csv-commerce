import { FastifyPluginAsync } from "fastify";
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { Order, orderId, order } from "../../common/orderSchema";

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    "/",
    {
      schema: {
        response: { 200: zodToJsonSchema(z.array(order)) },
      },
    },
    async function (request, response) {
      return fastify.orderStore.find({});
    }
  );

  fastify.get<{
    Params: { orderId: z.infer<typeof orderId> };
    Reply: Order;
  }>(
    "/:orderId",
    {
      schema: {
        response: { 200: zodToJsonSchema(order, { name: "Order" }) },
      },
    },
    async function (request, response) {
      const order = await fastify.orderStore.findById(request.params.orderId);

      if (!order) {
        response.notFound();
      } else {
        return order;
      }
    }
  );
};

export default users;
