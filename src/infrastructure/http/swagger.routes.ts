import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@config/swagger";

/**
 * Creates the Swagger documentation router.
 *
 * @returns The configured Swagger router.
 */
export default function swaggerRoutes() {
  const router = Router();
  router.get("/json", (_req, res) => {
    res.json(swaggerSpec);
  });
  router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  return router;
}
