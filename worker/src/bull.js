const fastifyPlugin = require("fastify-plugin");
const { addQueue, addQueueScheduler, addWorker } = require("./utils");

const dbg = require("debug");

const debug = (d) => dbg(`iot:${d}`);

const noop = () => {};
const debugLog = debug("BullMq");

let schedulers = [];

const bull = async (app, _opts, next) => {
  debugLog("BullMq plugin starting");

  app.decorate("queues", {
    addWorker: (options) => addWorker({ ...options, connection: app.redis }),
    addScheduler: (options) => {
      const scheduler = addQueueScheduler({
        ...options,
        connection: app.redis,
      });
      schedulers.push(scheduler);
      return scheduler;
    },
    addQueue: (options) =>
      addQueue({
        ...options,
        connection: app.redis,
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: 100,
        },
      }),
  });

  app.addHook("onClose", async (_instance, done) => {
    debugLog("Bull is closing along with the schedulers...");
    try {
      if (schedulers.length) {
        await Promise.all([
          ...schedulers.map(async (scheduler) => await scheduler.close()),
        ]);
      }
    } catch (error) {
      debugLog("Bull error...");
    }

    done();
  });
  next();
};

module.exports = fastifyPlugin(bull);
