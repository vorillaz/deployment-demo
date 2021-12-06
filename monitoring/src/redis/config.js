const config = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
};

module.exports = config;
