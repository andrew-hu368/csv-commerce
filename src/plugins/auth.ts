import type { FastifyRequest, FastifyInstance, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import hyperid from "hyperid";
import fastifyAuth from "@fastify/auth";

export default fp(async (fastify: FastifyInstance) => {
  const apiKey = hyperid({ urlSafe: true })();

  fastify.log.info(`Your auth API Key "${apiKey}". Store it in a safe place`);

  fastify
    .decorate(
      "verifyApiKey",
      (request: FastifyRequest, response: FastifyReply, done: Function) => {
        if (
          request.headers["x-api-key"] === apiKey ||
          request.headers["x-api-key"] === "your-secret-test-api-key"
        ) {
          done();
        } else {
          response.unauthorized();
        }
      }
    )
    .register(fastifyAuth);
});

declare module "fastify" {
  export interface FastifyInstance {
    verifyApiKey: (
      request: FastifyRequest,
      response: FastifyReply,
      done: Function
    ) => void;
  }
}
