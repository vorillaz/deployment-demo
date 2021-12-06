const Fastify = require("fastify");

const app = async () => {
  const fastify = Fastify({
    bodyLimit: 1048576 * 2,
    logger: {
      prettyPrint: {
        colorize: true,
        levelFirst: true,
        ignore: "time,pid,hostname",
      },
    },
  });

  await fastify.register(require("fastify-helmet"), {
    contentSecurityPolicy: {
      directives: {
        baseUri: ["'self'"],
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'self'"],
        workerSrc: ["'self'", "blob:"],
        frameSrc: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
  });
  await fastify.register(require("fastify-cors"), { origin: "*" });
  await fastify.register(require("./api"));

  fastify.setNotFoundHandler((request, reply) => {
    fastify.log.debug(`Route not found: ${request.method}:${request.raw.url}`);

    reply.status(404).send({
      statusCode: 404,
      error: "Not Found",
      message: `Route ${request.method}:${request.raw.url} not found`,
    });
  });

  fastify.setErrorHandler((err, request, reply) => {
    fastify.log.debug(`Request url: ${request.raw.url}`);
    fastify.log.debug(`Payload: ${request.body}`);
    fastify.log.error(`Error occurred: ${err}`);

    const code = err.statusCode ?? 500;

    reply.status(code).send({
      statusCode: code,
      error: err.name ?? "Internal server error",
      message: err.message ?? err,
    });
  });

  return fastify;
};

module.exports = {
  app,
};
