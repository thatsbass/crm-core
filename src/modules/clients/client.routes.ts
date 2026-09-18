import { Router } from "express";
import { ClientController } from "@modules/clients/client.controller";
import { authorizeRoles } from "@infrastructure/http/authorize.middleware";
import { UserRole } from "@modules/users/user.types";

/**
 * Creates the client HTTP router.
 *
 * @param clientController - Controller responsible for client requests.
 * @returns The configured client router.
 */
export default function clientRoutes(clientController: ClientController) {
  const router = Router();

  router.use(authorizeRoles(UserRole.ADMIN));
  router.post("/", clientController.createClient.bind(clientController));
  router.get("/", clientController.listClients.bind(clientController));
  router.get("/:identifier", clientController.getClient.bind(clientController));
  router.patch("/:identifier", clientController.updateClient.bind(clientController));
  router.delete("/:identifier", clientController.deleteClient.bind(clientController));

  return router;
}
