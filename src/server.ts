import dotenv from "dotenv";
import closeWithGrace from "close-with-grace";
import Fastify from "fastify";

import appService from "./app";

dotenv.config();
// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
});

app.register(appService);

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace(
  // @ts-expect-error
  { delay: process.env.FASTIFY_CLOSE_GRACE_DELAY || 500 },
  // @ts-expect-error
  async function ({ signal, err, manual }) {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  }
);

app.addHook("onClose", async (instance, done) => {
  closeListeners.uninstall();
  done();
});

// Start listening.
// @ts-expect-error
app.listen({ port: process.env.PORT || 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
