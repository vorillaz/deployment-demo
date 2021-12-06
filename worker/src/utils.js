const { Job, Queue, QueueScheduler, Worker } = require("bullmq");
const dbg = require("debug");

const debug = (d) => dbg(`iot:${d}`);

const noop = () => {};
const debugLog = debug("BullMq");

const addQueue = async ({ name, ...options }) => {
  debugLog(`Adding queue ${name}`);
  const queue = await new Queue(name, options);
  return queue;
};

const addQueueScheduler = ({ name, ...options }) => {
  debugLog(`Adding queue scheduler ${name}`);
  const queueScheduler = new QueueScheduler(name, options);
  return queueScheduler;
};

const addWorker = ({ name, processor, ...options }) => {
  debugLog(`Adding worker ${name}`);
  const {
    onActive = noop,
    onCompleted = noop,
    onFailed = noop,
    onWaiting = noop,
    ...config
  } = options;
  const worker = new Worker(name, processor, config);

  worker.on("active", (job) => {
    debugLog(`Job ${name}:${job.id} started`);
    onActive && onActive(job);
  });

  worker.on("completed", (job) => {
    debugLog(`Job ${name}:${job.id} completed`);
    onCompleted && onCompleted(job);
  });

  worker.on("waiting", (job) => {
    debugLog(`Job ${name}:${job.id} is waiting to be processed`);
    onWaiting && onWaiting(job);
  });

  worker.on("failed", (job) => {
    debugLog(`Job ${name}:${job.id} failed`);
    onFailed && onFailed(job);
  });

  return worker;
};

module.exports = {
  addQueue,
  addQueueScheduler,
  addWorker,
};
