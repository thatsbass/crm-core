import express from "express";
import { authController, clientController, logController } from "@bootstrap/composition";
import { errorMiddleware } from "@infrastructure/http/error.middleware";
import { authenticate } from "@infrastructure/http/auth.middleware";
import authRoutes from "@modules/auth/auth.routes";
import clientRoutes from "@modules/clients/client.routes";
import logRoutes from "@modules/logs/log.routes";
import swaggerRoutes from "@infrastructure/http/swagger.routes";

/**
 * Builds the Express application and registers its middleware and routes.
 *
 * @returns A configured Express application instance.
 */
export function createApp() {
  const app = express();
  const apiRouter = express.Router();

  app.use(express.json());
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  app.use("/docs", swaggerRoutes());
  apiRouter.use("/auth", authRoutes(authController));
  apiRouter.use("/clients", authenticate, clientRoutes(clientController));
  apiRouter.use("/logs", authenticate, logRoutes(logController));
  app.use("/v1/api", apiRouter);
  app.use(errorMiddleware);
  return app;
}
