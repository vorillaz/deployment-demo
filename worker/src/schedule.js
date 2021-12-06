const dbg = require("debug");

const debug = (d) => dbg(`iot:${d}`);
const debugLog = debug("AddJobDemo");

const api = async (fastify, options, done) => {
  fastify.addHook("onReady", async function () {
    debugLog("onReady");
    const _that = this;

    const { addScheduler, addWorker, addQueue } = _that.queues;
    const queue = await addQueue({ name: "rotate" });

    const monitoring = JSON.parse(process.env.MONITORING_SERVICES);
    const monitoringQueues = await Promise.all(
      monitoring.map((monitoring) => addQueue({ name: monitoring }))
    );
    await queue.add(
      "rollup",
      {},
      {
        removeOnComplete: true,
        removeOnFail: 1000,
        repeat: {
          every: 10000,
          limit: 100,
        },
      }
    );
    addScheduler({ name: "rotate" });
    addWorker({
      name: "rotate",
      processor: async () => {
        const q =
          monitoringQueues[Math.floor(Math.random() * monitoringQueues.length)];
        await q.add("makeit", {}, { removeOnComplete: true });
        return "done";
      },
    });
  });

  fastify.get("/", async (request, reply) => {
    return "worker started";
  });

  done();
};

module.exports = api;
