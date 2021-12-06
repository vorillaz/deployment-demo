const api = (fastify, options, done) => {
  fastify.get("/health", async (request, reply) => {
    return { status: "ok" };
  });
  done();
};

module.exports = api;
