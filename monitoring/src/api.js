const dbg = require("debug");

const debug = (d) => dbg(`iot:${d}`);
const debugLog = debug("Worker");

const api = (fastify, options, done) => {
  const { redis } = fastify;

  fastify.addHook("onReady", async function () {
    debugLog("worker setup");
    const _that = this;
    const { addWorker } = _that.queues;
    const location = process.env.LOCATION;

    addWorker({
      name: location,
      processor: async () => {
        debugLog("worker processing for location:", location);
        return "done";
      },
    });
  });

  fastify.get("/health", async (request, reply) => {
    const key = `${process.env.LOCATION}_key`;
    await redis.set(key, Math.random());
    const res = await redis.get(key);
    return {
      status: "ok",
      key_for_location: res,
      location: process.env.LOCATION,
    };
  });
  done();
};

module.exports = api;
