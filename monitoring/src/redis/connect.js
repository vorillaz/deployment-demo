const Redis = require("ioredis");
const defaultConfig = require("./config");
const dbg = require("debug");

const debug = (d) => dbg(`iot:${d}`);

const debugLog = debug("Redis");

let redisInstance;

const connect = (conf = {}) => {
  return new Promise((res, rej) => {
    if (redisInstance) {
      res({ r: redisInstance });
      return;
    }

    debugLog("Connecting to redis with additional params");

    redisInstance = new Redis({
      host: "redis",
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      ...defaultConfig,
    });

    redisInstance.on("error", () => {
      debugLog("Redis connection error");
      return rej(new Error("Redis connection error"));
    });

    redisInstance.on("ready", () => {
      debugLog("Connected");
      redisInstance.config("SET", "notify-keyspace-events", "Ex");
      res({ r: redisInstance });
    });
  });
};

module.exports = connect;
