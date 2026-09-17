import { Router } from "express";
import { LogController } from "@modules/logs/log.controller";

/**
 * Creates the log HTTP router.
 *
 * @param logController - Controller responsible for log requests.
 * @returns The configured log router.
 */
export default function logRoutes(logController: LogController) {
  const router = Router();

  router.get("/:phone", logController.findLogByPhone.bind(logController));
  router.get("/", logController.getAllLogs.bind(logController));

  return router;
}
