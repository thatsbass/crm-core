import { Router } from "express";
import { LogController } from "@modules/logs/log.controller";
import { authorizeRoles } from "@infrastructure/http/authorize.middleware";
import { UserRole } from "@modules/users/user.types";

/**
 * Creates the log HTTP router.
 *
 * @param logController - Controller responsible for log requests.
 * @returns The configured log router.
 */
export default function logRoutes(logController: LogController) {
  const router = Router();

  router.use(authorizeRoles(UserRole.ADMIN, UserRole.AGENT));
  router.get("/:phone", logController.findLogByPhone.bind(logController));
  router.get("/", logController.getAllLogs.bind(logController));

  return router;
}
