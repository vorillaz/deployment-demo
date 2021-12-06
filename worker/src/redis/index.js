const fastifyPlugin = require("fastify-plugin");
const connect = require("./connect");
const dbg = require("debug");

const debug = (d) => dbg(`iot:${d}`);

const debugLog = debug("Redis");

const redisConnector = async (app, _opts, next) => {
  const { r } = await connect();
  app.decorate("redis", r);
  app.addHook("onClose", async (instance, done) => {
    debugLog("Redis is closing...");
    try {
      const { redis } = instance;
      redis && redis.disconnect && redis.disconnect();
    } catch (error) {
      debugLog("Redis error...");
    }

    done();
  });

  next();
};

module.exports = fastifyPlugin(redisConnector);
