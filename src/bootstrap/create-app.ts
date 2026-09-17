import express from "express";
import { clientController, logController } from "@bootstrap/composition";
import { errorMiddleware } from "@infrastructure/http/error.middleware";
import clientRoutes from "@modules/clients/client.routes";
import logRoutes from "@modules/logs/log.routes";

/**
 * Builds the Express application and registers its middleware and routes.
 *
 * @returns A configured Express application instance.
 */
export function createApp() {
  const app = express();
  const apiRouter = express.Router();

  app.use(express.json());
  apiRouter.use("/clients", clientRoutes(clientController));
  apiRouter.use("/logs", logRoutes(logController));
  app.use("/v1/api", apiRouter);
  app.use(errorMiddleware);

  return app;
}
