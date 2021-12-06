const { app: server } = require("./app");

const port = process.env.APP_PORT || 3101;
server()
  .then((app) => {
    app
      .listen(port, "0.0.0.0")
      .then((_) => {
        process
          .on("SIGINT", () => {
            app.close();
            process.exit(0);
          })
          .on("SIGTERM", () => {
            app.close();
            process.exit(0);
          })
          .on("uncaughtException", (err) => {
            console.error(err.stack);
            process.exit(1);
          })
          .on("unhandledRejection", (reason, promise) => {
            console.error(reason, `Unhandled rejection at Promise: ${promise}`);
          });
      })
      .catch((err) => {
        console.log("Error starting server: ", err);
        process.exit(1);
      });
  })
  .catch((err) => console.log(err));
