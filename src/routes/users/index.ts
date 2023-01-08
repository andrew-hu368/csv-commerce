import { FastifyPluginAsync } from "fastify";
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { User, userId, user } from "../../common/userSchema";

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    "/",
    {
      preHandler: fastify.auth([fastify.verifyApiKey]),
      schema: {
        response: { 200: zodToJsonSchema(z.array(user), { name: "Users" }) },
      },
    },
    async function (request, response) {
      return fastify.userStore.find({});
    }
  );

  fastify.get<{ Params: { userId: z.infer<typeof userId> }; Response: User }>(
    "/:userId",
    {
      preHandler: fastify.auth([fastify.verifyApiKey]),
      schema: {
        response: { 200: zodToJsonSchema(user, { name: "User" }) },
      },
    },
    async function (request, response) {
      const user = await fastify.userStore.findById(request.params.userId);

      if (!user) {
        response.notFound();
      } else {
        return user;
      }
    }
  );
};

export default users;
