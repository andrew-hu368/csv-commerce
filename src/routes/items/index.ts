import { FastifyPluginAsync } from "fastify";
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { itemId, item, Item } from "../../common/itemSchema";

const items: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{
    Querystring: {
      name?: Item["name"];
    };
    Reply: Item[];
  }>(
    "/",
    {
      schema: {
        querystring: zodToJsonSchema(
          z.object({
            name: z.string().optional(),
          })
        ),
        response: { 200: zodToJsonSchema(z.array(item)) },
      },
    },
    async function (request, response) {
      const items = await fastify.itemStore.find({
        name: request.query.name,
      });
      return items;
    }
  );

  fastify.get<{
    Params: { itemId: z.infer<typeof itemId> };
    Reply: Item;
  }>(
    "/:itemId",
    {
      schema: {
        params: zodToJsonSchema(z.object({ itemId })),
        response: { 200: zodToJsonSchema(item, { name: "Item" }) },
      },
    },
    async function (request, response) {
      const item = await fastify.itemStore.findById(request.params.itemId);

      if (!item) {
        response.notFound();
      } else {
        return item;
      }
    }
  );
};

export default items;
