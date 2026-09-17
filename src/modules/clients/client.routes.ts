import { Router } from "express";
import { ClientController } from "@modules/clients/client.controller";

/**
 * Creates the client HTTP router.
 *
 * @param clientController - Controller responsible for client requests.
 * @returns The configured client router.
 */
export default function clientRoutes(clientController: ClientController) {
  const router = Router();

  router.get(
    "/:phone",
    clientController.findClientByPhone.bind(clientController),
  );

  return router;
}
