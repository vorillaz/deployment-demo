const fastifyPlugin = require("fastify-plugin");
const { addQueue, addQueueScheduler, addWorker } = require("./utils");

let schedulers = [];

const bull = async (app, _opts, next) => {
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
  next();
};

module.exports = fastifyPlugin(bull);
